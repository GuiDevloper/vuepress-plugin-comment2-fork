import { LocaleConfig, PluginFunction } from '@vuepress/core';
import { WalineLocale, WalineInitOptions } from '@waline/client';
import { BasePageFrontMatter, RequiredLocaleConfig } from 'vuepress-shared';
import ArtalkConfig from 'artalk/types/artalk-config.js';

interface CommentPluginFrontmatter extends BasePageFrontMatter {
    /**
     * 是否启用评论
     *
     * Whether Enable Comment
     *
     * @default true
     */
    comment?: boolean;
    /**
     * @description Only available when using valine
     *
     * 是否启用访问量
     *
     * Whether enable pageviews
     *
     * @default true
     */
    pageview?: boolean;
}

interface BaseCommentOptions {
    /**
     * Whether enable comment by default
     *
     * 是否默认启用评论
     *
     * @default true
     */
    comment?: boolean;
    /**
     * The delay of dom operation, in ms
     *
     * If the theme you are using has a switching animation, it is recommended to configure this option to `Switch animation duration + 200`
     *
     * 进行 DOM 操作的延时，单位 ms
     *
     * 如果你使用的主题有切换动画，建议配置此选项为 `切换动画时长 + 200`
     *
     * @default 800
     */
    delay?: number;
}

interface ArtalkOptions extends BaseCommentOptions, Partial<Omit<ArtalkConfig.default, "el" | "imgUploader" | "avatarURLBuilder" | "pageKey">> {
    provider: "Artalk";
}

type GiscusRepo = `${string}/${string}`;
type GiscusMapping = "url" | "title" | "og:title" | "specific" | "number" | "pathname";
type GiscusInputPosition = "top" | "bottom";
type GiscusTheme = "light" | "light_high_contrast" | "light_protanopia" | "dark" | "dark_high_contrast" | "dark_protanopia" | "dark_dimmed" | "transparent_dark" | "preferred_color_scheme" | `https://${string}`;
declare const SUPPORTED_LANGUAGES: readonly ["ar", "de", "gsw", "en", "es", "fa", "fr", "id", "it", "ja", "ko", "nl", "pl", "pt", "ro", "ru", "th", "tr", "uk", "vi", "zh-CN", "zh-TW"];
type GiscusLang = (typeof SUPPORTED_LANGUAGES)[number];
interface GiscusOptions extends BaseCommentOptions {
    provider: "Giscus";
    /**
     * The name of repository to store discussions.
     *
     * 存放评论的仓库
     */
    repo: GiscusRepo;
    /**
     * The ID of repository to store discussions.
     *
     * 仓库 ID
     */
    repoId: string;
    /**
     * The name of the discussion category.
     *
     * 讨论分类
     */
    category: string;
    /**
     * The ID of the discussion category.
     *
     * 分类 ID
     */
    categoryId: string;
    /**
     * Page - discussion mapping.
     *
     * 页面 ↔️ discussion 映射关系
     *
     * @default "pathname"
     */
    mapping?: GiscusMapping;
    /**
     * Whether enable strict mapping
     *
     * 是否启用严格匹配
     *
     * @default true
     */
    strict?: boolean;
    /**
     * Whether enable lazy loading
     *
     * 是否启用懒加载
     *
     * @default true
     */
    lazyLoading?: boolean;
    /**
     * Whether enable reactions or not
     *
     * 是否启用主帖子上的反应
     *
     * @default true
     */
    reactionsEnabled?: boolean;
    /**
     * Input position
     *
     * 输入框的位置
     *
     * @default "top"
     */
    inputPosition?: GiscusInputPosition;
    /**
     * Giscus theme used in lightmode
     *
     * @description Should be a built-in theme keyword or a css link starting with `https://`
     *
     * Giscus 在日间模式下使用的主题
     *
     * @description 应为一个内置主题关键词或者一个 CSS 链接
     *
     * @default "light"
     */
    lightTheme?: GiscusTheme;
    /**
     * Giscus theme used in darkmode
     *
     * @description Should be a built-in theme keyword or a css link starting with `https://`
     *
     * Giscus 在夜间模式下使用的主题
     *
     * @description 应为一个内置主题关键词或者一个 CSS 链接
     *
     * @default "dark"
     */
    darkTheme?: GiscusTheme;
    /**
     * The language which giscus will be displayed in
     *
     * 语言 giscus 将显示在
     *
     * @default usePageLang().value
     */
    lang?: GiscusLang;
}

interface DisableCommentOptions extends BaseCommentOptions {
    provider?: "None";
    comment?: never;
}

interface TwikooInitOptions {
    /**
     * Environment ID for tencloud or Link for Vercel
     *
     * 腾讯云环境链接或 Vercel Link
     */
    envId: string;
    /**
     * Tencloud region
     *
     * 腾讯云区域
     *
     * @default "ap-shanghai"
     */
    region?: string;
}
interface TwikooOptions extends BaseCommentOptions, TwikooInitOptions {
    provider: "Twikoo";
}

type WalineLocaleData = Partial<WalineLocale>;
type WalineLocaleConfig = RequiredLocaleConfig<WalineLocaleData>;
interface WalineOptions extends BaseCommentOptions, Omit<WalineInitOptions, "el" | "comment" | "locale" | "search" | "imageUploader" | "texRenderer"> {
    provider: "Waline";
    /**
     * Whether import meta icons
     *
     * 是否导入 Meta 图标
     *
     * @default true
     */
    metaIcon?: boolean;
    /**
     * Whether enable page views count by default
     *
     * 是否启用访问量
     *
     * @default true
     */
    pageview?: boolean;
    /**
     * Whether enable gif search
     *
     * 是否启用表情包搜索
     *
     * @default true
     */
    search?: boolean;
    /**
     * Locale config for waline
     */
    locales?: LocaleConfig<WalineLocaleData>;
}

/**
 * 评论选项
 *
 * Comment options
 */
type CommentOptions = ArtalkOptions | GiscusOptions | TwikooOptions | WalineOptions | DisableCommentOptions;

/**
 * Default locale config for Waline
 */
declare const walineLocales: WalineLocaleConfig;

/** Comment Plugin */
declare const commentPlugin: (options: CommentOptions, legacy?: boolean) => PluginFunction;

export { ArtalkOptions, CommentOptions, CommentPluginFrontmatter, GiscusInputPosition, GiscusLang, GiscusMapping, GiscusOptions, GiscusRepo, GiscusTheme, SUPPORTED_LANGUAGES, TwikooInitOptions, TwikooOptions, WalineLocaleConfig, WalineLocaleData, WalineOptions, commentPlugin, walineLocales };
