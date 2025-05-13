import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export type PostMeta = {
    slug: string;
    title: string;
    date: string;
    excerpt?: string; // 概要を追加
    tags?: string[];
};

export type PostData = PostMeta & {
    contentHtml: string;
};

/**
 * Markdownの本文から概要を生成するヘルパー関数
 * @param content Markdownの本文
 * @param maxLines 概要として抽出する最大行数
 * @param maxLength 概要の最大文字数
 * @returns 生成された概要テキスト
 */
function generateExcerpt(content: string, maxLines: number = 3, maxLength: number = 120): string {
    if (!content) {
        return '';
    }

    // 簡単なMarkdown記法を除去
    const plainText = content
        .replace(/^#+\s+/gm, '') // 見出し
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // リンク
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // コード
        .replace(/(\*\*|__)(.*?)\1/g, '$2')    // 太字
        .replace(/(\*|_)(.*?)\1/g, '$2')      // 斜体
        .replace(/^\s*>\s+/gm, '')           // 引用
        .replace(/^\s*[\-\*\+]\s+/gm, '');   // リストマーカー

    const lines = plainText.split('\n').filter(line => line.trim() !== ''); // 空行を除去
    let excerpt = lines.slice(0, maxLines).join(' ').trim();

    if (excerpt.length > maxLength) {
        excerpt = excerpt.substring(0, maxLength).trimEnd() + '...';
    } else if (lines.length > maxLines && excerpt.length > 0) {
        excerpt += '...';
    }

    return excerpt;
}

export async function getPostData(slug: string): Promise<PostData> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    const frontmatter = matterResult.data as { title: string; date: string; excerpt?: string; tags?: string[] };

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();
    const excerpt = frontmatter.excerpt || generateExcerpt(matterResult.content);

    return {
        slug,
        contentHtml,
        ...frontmatter,
        excerpt,
    };
}

export async function getAllPosts(): Promise<PostMeta[]> {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const frontmatter = matterResult.data as { title: string; date: string; excerpt?: string; tags?: string[] };
        const excerpt = frontmatter.excerpt || generateExcerpt(matterResult.content);
        return {
            slug,
            ...frontmatter,
            excerpt,
        };
    });
}