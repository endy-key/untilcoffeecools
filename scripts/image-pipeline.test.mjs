import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { collectBodyImages, generateImages, localImagePath, validateImagePath } from './image-pipeline.mjs';

// 実データを変更せず、投稿・再生成・失敗の各経路を一時フォルダで検証します。
async function fixture(t) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-image-test-'));
    t.after(async () => {
        const resolved = path.resolve(root);
        assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
        assert.ok(path.basename(resolved).startsWith('blog-image-test-'));
        await fs.rm(resolved, { recursive: true, force: true });
    });
    await fs.mkdir(path.join(root, 'public', 'sample'), { recursive: true });
    await fs.mkdir(path.join(root, 'content', 'posts'), { recursive: true });
    return root;
}

test('Markdown・参照形式・リンク内・HTMLの画像を収集し、コード例は除外する', async () => {
    const urls = await collectBodyImages('![a](/a.png)\n\n[![b](/b.jpg)](/b.jpg)\n\n![c][ref]\n\n[ref]: /c.webp\n\n<img src="/d.png">\n\n```md\n![ignored](/ignored.png)\n```');
    assert.deepEqual(urls, ['/a.png', '/b.jpg', '/c.webp', '/d.png']);
});

test('空白入りパスに対応し、外部画像を除外し、不正なパスは拒否する', () => {
    assert.equal(localImagePath('/sample/Main%200.png'), '/sample/Main 0.png');
    assert.equal(localImagePath('https://example.com/a.png'), null);
    assert.equal(localImagePath('//example.com/a.png'), null);
    assert.equal(localImagePath('/a.svg'), null);
    assert.throws(() => localImagePath('/%2e%2e/a.png'));
});

test('サイズ別生成・元画像保持・再生成・画像追加・大小文字検証', async (t) => {
    const root = await fixture(t);
    const publicDir = path.join(root, 'public');
    const source = path.join(publicDir, 'sample', 'Main 0.png');
    await sharp({ create: { width: 1800, height: 900, channels: 3, background: '#927354' } }).png({ compressionLevel: 0 }).toFile(source);
    const original = await fs.readFile(source);
    const post = path.join(root, 'content', 'posts', 'sample.md');
    await fs.writeFile(post, '---\nthumbnail: "/sample/Main%200.png"\n---\n![image](/sample/Main%200.png)');
    const manifest = await generateImages(root);
    const image = manifest['/sample/Main%200.png'];
    assert.deepEqual(image.variants.thumbnail.map((variant) => variant.width), [320, 640, 960]);
    assert.deepEqual(image.variants.body.map((variant) => variant.width), [480, 960, 1600]);
    assert.equal(image.variants.og[0].width, 1200);
    assert.match(image.variants.og[0].src, /\.jpg$/);
    for (const variant of Object.values(image.variants).flat()) {
        assert.ok(variant.bytes < original.length);
        assert.equal(variant.width / variant.height, 2);
        await fs.access(path.join(publicDir, variant.src));
    }
    assert.deepEqual(await fs.readFile(source), original);
    assert.deepEqual(await generateImages(root), manifest);

    // 元画像を差し替えるとURLが変わり、キャッシュされた旧画像とは分離されます。
    await sharp({ create: { width: 1800, height: 900, channels: 3, background: '#164723' } }).png().toFile(source);
    assert.notEqual((await generateImages(root))['/sample/Main%200.png'].variants.body[0].src, image.variants.body[0].src);

    await sharp({ create: { width: 48, height: 24, channels: 3, background: 'white' } }).webp().toFile(path.join(publicDir, 'sample', 'small.webp'));
    await fs.appendFile(post, '\n![small](/sample/small.webp)');
    const added = (await generateImages(root))['/sample/small.webp'];
    assert.ok(added.variants.body.every((variant) => variant.width <= 48 && variant.height <= 24));
    assert.ok(added.variants.body.every((variant) => variant.bytes <= added.original.bytes));

    await assert.rejects(validateImagePath(publicDir, '/sample/main%200.png'), /大文字・小文字/);
    await fs.appendFile(post, '\n![missing](/sample/missing.png)');
    await assert.rejects(generateImages(root), /sample.md.*missing.png/);
});
