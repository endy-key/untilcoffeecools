import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

// 記事はデータとして読み込み、gray-matterの言語自動判定からコードを実行させません。
// BOMとCRLFにも対応し、言語指定のない通常のfrontmatterとYAMLだけを許可します。
export function parsePostMarkdown(source) {
    const normalized = source.replace(/^\uFEFF/, '');
    const opening = /^---(?!--)([^\r\n]*)(?:\r?\n|$)/.exec(normalized);
    if (opening && !['', 'yaml', 'yml'].includes(opening[1].trim())) {
        throw new Error('記事のfrontmatterはYAML形式のみ使用できます。');
    }

    // オプションを渡して既定キャッシュを使わず、JSエンジンも明示的に無効にします。
    return matter(normalized, {
        engines: {
            javascript: () => {
                throw new Error('記事のfrontmatterでJavaScriptは実行できません。');
            },
        },
    });
}

// 手書きHTMLを解析した直後に危険なタグ・属性・URLを除去します。
// 画像最適化やコードの色付けは、この安全化済みのツリーに対してのみ適用します。
export function createPostProcessor() {
    return remark()
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSanitize);
}
