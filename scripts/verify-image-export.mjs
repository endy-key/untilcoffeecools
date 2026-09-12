import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

// 公開成果物内の画像参照をたどり、S3へ送る前にリンク切れを検出します。
async function htmlFiles(directory) {
    const files = [];
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await htmlFiles(file));
        else if (entry.name.endsWith('.html')) files.push(file);
    }
    return files;
}

const output = path.resolve('out');
const files = await htmlFiles(output);
const generated = new Set();
let bodyImages = 0;
for (const file of files) {
    const html = await fs.readFile(file, 'utf8');
    for (const match of html.matchAll(/\/_generated\/images\/[a-f0-9]+-\d+\.(?:webp|jpg)/g)) generated.add(match[0]);
    for (const match of html.matchAll(/<img\b[^>]*data-original-src="([^"]+)"[^>]*>/g)) {
        assert.match(match[0], /srcSet=/i);
        assert.match(match[0], /loading="lazy"/);
        assert.match(match[0], /width="\d+"/);
        assert.match(match[0], /height="\d+"/);
        await fs.access(path.join(output, decodeURIComponent(match[1])));
        bodyImages++;
    }
}
for (const url of generated) await fs.access(path.join(output, url));
assert.ok(generated.size > 0);
assert.ok(bodyImages > 0);
console.log(`${files.length} HTML、${generated.size}種類の生成画像URL、${bodyImages}枚の本文画像: 検証成功`);
