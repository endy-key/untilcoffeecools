import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { createPostProcessor, parsePostMarkdown } from '../src/lib/post-markdown.mjs';
import { collectBodyImages, generateImages } from './image-pipeline.mjs';
import os from 'node:os';
import path from 'node:path';

// 危険な入力と通常の記事を、実際の表示処理と同じ順序でHTMLへ変換します。
async function render(content) {
    return String(await createPostProcessor().use(rehypeHighlight).use(rehypeStringify).process(content));
}

test('通常のYAML・明示的なYAML指定・BOMとCRLFを読み込める', () => {
    for (const language of ['', 'yaml', 'yml']) {
        const result = parsePostMarkdown(`\uFEFF---${language}\r\ntitle: 記事\r\ndate: "2026-09-21"\r\n---\r\n本文`);
        assert.equal(result.data.title, '記事');
        assert.equal(result.data.date, '2026-09-21');
        assert.equal(result.content, '本文');
    }
    assert.equal(parsePostMarkdown('本文だけ').content, '本文だけ');
});

test('JavaScript形式を別名・空白・BOMを含めて実行前に拒否する', () => {
    globalThis.postSecurityProbe = false;
    try {
        for (const language of ['js', 'javascript', 'JS', 'JavaScript', ' js ', 'json', 'constructor']) {
            for (const prefix of ['', '\uFEFF']) {
                assert.throws(
                    () => parsePostMarkdown(`${prefix}---${language}\n(globalThis.postSecurityProbe = true, {})\n---\n本文`),
                    /YAML形式のみ/,
                );
            }
        }
        assert.equal(globalThis.postSecurityProbe, false);
        assert.throws(() => parsePostMarkdown('---\nx: !!js/function >\n  function () {}\n---\n本文'));
    } finally {
        delete globalThis.postSecurityProbe;
    }
});

test('イベント属性・危険なURL・実行可能な埋め込みを除去する', async () => {
    const html = await render([
        '<img src="/photo.png" onerror="alert(1)" data-original-src="https://evil.example/image.png">',
        '<a href="jav&#x61;script:alert(1)" onclick="alert(1)">リンク</a>',
        '<script>alert(1)</script>',
        '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
        '<svg onload="alert(1)"></svg>',
        '<img src="data:image/svg+xml,test">',
    ].join('\n\n'));
    assert.match(html, /src="\/photo.png"/);
    assert.doesNotMatch(html, /onerror|onclick|onload|javascript:|data-original-src|data:image|<script|<iframe|<svg/);
    assert.deepEqual(await collectBodyImages('<img src="javascript:alert(1)"><img src="/photo.png" onerror="alert(1)">'), ['/photo.png']);
});

test('表・改行・画像・リンク・コードの色付けを維持する', async () => {
    const html = await render([
        '| 列 |\n| --- |\n| 値<br>続き |',
        '![画像](/photo.png)',
        '[外部リンク](https://example.com)',
        '```js\nconst value = "<script>";\n```',
    ].join('\n\n'));
    assert.match(html, /<table>/);
    assert.match(html, /値<br>続き/);
    assert.match(html, /<img src="\/photo.png" alt="画像">/);
    assert.match(html, /href="https:\/\/example.com"/);
    assert.match(html, /hljs-keyword/);
    assert.match(html, /&#x3C;script>/);
});

test('既存の全記事でメタデータと本文画像の参照が維持される', async () => {
    const postsDir = new URL('../content/posts/', import.meta.url);
    for (const name of (await fs.readdir(postsDir)).filter((name) => name.endsWith('.md'))) {
        const post = parsePostMarkdown(await fs.readFile(new URL(name, postsDir), 'utf8'));
        assert.equal(typeof post.data.title, 'string', name);
        const images = await collectBodyImages(post.content);
        const html = await render(post.content);
        for (const image of images) assert.ok(html.includes(image), `${name}: ${image}`);
        assert.doesNotMatch(html, /<(script|iframe)\b/i, name);
    }
});

test('画像生成の入口でもJavaScript形式の記事を拒否する', async (t) => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-security-test-'));
    t.after(async () => {
        // このテストで作成した一時ディレクトリだけを削除します。
        const resolved = path.resolve(root);
        assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
        assert.ok(path.basename(resolved).startsWith('blog-security-test-'));
        await fs.rm(resolved, { recursive: true, force: true });
    });
    await fs.mkdir(path.join(root, 'content', 'posts'), { recursive: true });
    await fs.writeFile(path.join(root, 'content', 'posts', 'unsafe.md'), '---js\n({ title: "実行禁止" })\n---\n本文');
    await assert.rejects(generateImages(root), /YAML形式のみ/);
});
