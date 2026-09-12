import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';

const profiles = {
    thumbnail: { widths: [320, 640, 960], quality: 82, format: 'webp' },
    body: { widths: [480, 960, 1600], quality: 90, format: 'webp' },
    og: { widths: [1200], quality: 85, format: 'jpeg' },
};

// URLをpublic内のパスへ変換し、外部画像や変換対象外の形式を除外します。
export function localImagePath(url) {
    if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//')) return null;
    const decoded = decodeURIComponent(url.split(/[?#]/)[0]);
    if (!/\.(png|jpe?g|webp)$/i.test(decoded)) return null;
    if (decoded.includes('\\') || decoded.split('/').some((part) => part === '..' || part === '.') || decoded.includes('\0')) {
        throw new Error(`画像パスが不正です: ${url}`);
    }
    return decoded;
}

// Windowsでも大文字・小文字を区別して調べ、S3上だけで起こる画像切れを防ぎます。
export async function validateImagePath(publicDir, url) {
    const decoded = localImagePath(url);
    if (!decoded) return null;
    let current = publicDir;
    for (const part of decoded.slice(1).split('/')) {
        const names = await fs.readdir(current);
        if (!names.includes(part)) throw new Error(`画像が存在しないか、大文字・小文字が一致しません: ${url}`);
        current = path.join(current, part);
    }
    if (!(await fs.stat(current)).isFile()) throw new Error(`画像ファイルではありません: ${url}`);
    return current;
}

// Markdownの参照形式・リンク内画像・HTML画像を、本文と同じパーサーで収集します。
export async function collectBodyImages(content) {
    const processor = remark().use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw);
    const tree = await processor.run(processor.parse(content));
    const urls = [];
    function walk(node) {
        if (node.type === 'element' && node.tagName === 'img' && typeof node.properties.src === 'string') {
            urls.push(node.properties.src);
        }
        for (const child of node.children ?? []) walk(child);
    }
    walk(tree);
    return urls;
}

// 元ファイルのURLはそのまま残し、変換結果だけを専用ディレクトリへ保存します。
export async function generateImages(root = process.cwd()) {
    const publicDir = path.join(root, 'public');
    const outputDir = path.join(publicDir, '_generated', 'images');
    const postsDir = path.join(root, 'content', 'posts');
    const usages = new Map();
    for (const name of (await fs.readdir(postsDir)).filter((name) => name.endsWith('.md')).sort()) {
        const post = matter(await fs.readFile(path.join(postsDir, name), 'utf8'));
        const references = (await collectBodyImages(post.content)).map((url) => [url, 'body']);
        if (post.data.thumbnail) references.push([post.data.thumbnail, 'thumbnail'], [post.data.thumbnail, 'og']);
        for (const [url, profile] of references) {
            try {
                const source = await validateImagePath(publicDir, url);
                if (!source) continue;
                const entry = usages.get(url) ?? { source, profiles: new Set() };
                entry.profiles.add(profile);
                usages.set(url, entry);
            } catch (error) {
                throw new Error(`${name}: ${error.message}`, { cause: error });
            }
        }
    }

    await fs.mkdir(outputDir, { recursive: true });
    const manifest = {};
    for (const [url, usage] of usages) {
        const input = await fs.readFile(usage.source);
        const metadata = await sharp(input).metadata();
        // アニメーションは静止画へ変換せず、元の表示を維持します。
        if ((metadata.pages ?? 1) > 1) continue;
        const swapped = [5, 6, 7, 8].includes(metadata.orientation);
        const width = swapped ? metadata.height : metadata.width;
        const height = swapped ? metadata.width : metadata.height;
        const original = { src: url, width, height, bytes: input.length };
        const entry = { original, variants: {} };
        for (const profile of usage.profiles) {
            const settings = profiles[profile];
            const widths = [...new Set(settings.widths.map((size) => Math.min(size, width)))];
            const variants = [];
            for (const size of widths) {
                const hash = createHash('sha256').update(input).update(JSON.stringify({ ...settings, size, version: 1 })).digest('hex').slice(0, 20);
                const fileName = `${hash}-${size}.${settings.format === 'jpeg' ? 'jpg' : 'webp'}`;
                let pipeline = sharp(input).rotate().resize({ width: size, withoutEnlargement: true });
                if (settings.format === 'jpeg') pipeline = pipeline.flatten({ background: '#ffffff' });
                const { data, info } = await pipeline.toFormat(settings.format, { quality: settings.quality }).toBuffer({ resolveWithObject: true });
                // OGPも含め、容量が増える場合は元画像へフォールバックします。
                if (data.length >= input.length) continue;
                await fs.writeFile(path.join(outputDir, fileName), data);
                variants.push({ src: `/_generated/images/${fileName}`, width: info.width, height: info.height, bytes: data.length });
            }
            entry.variants[profile] = variants.length ? variants : [original];
        }
        manifest[url] = entry;
    }
    // すべての検証・変換が成功してから対応表を更新し、不完全な結果を参照させません。
    await fs.writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    return manifest;
}
