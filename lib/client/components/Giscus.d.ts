import * as vue from 'vue';
import { VNode } from 'vue';

type GiscusRepo = `${string}/${string}`;
type GiscusMapping = "url" | "title" | "og:title" | "specific" | "number" | "pathname";
type GiscusInputPosition = "top" | "bottom";
type GiscusTheme = "light" | "light_high_contrast" | "light_protanopia" | "dark" | "dark_high_contrast" | "dark_protanopia" | "dark_dimmed" | "transparent_dark" | "preferred_color_scheme" | `https://${string}`;
declare const SUPPORTED_LANGUAGES: readonly ["ar", "de", "gsw", "en", "es", "fa", "fr", "id", "it", "ja", "ko", "nl", "pl", "pt", "ro", "ru", "th", "tr", "uk", "vi", "zh-CN", "zh-TW"];
type GiscusLang = (typeof SUPPORTED_LANGUAGES)[number];

type BooleanString = "0" | "1";
type GiscusLoading = "lazy" | "eager";
interface GiscusProps {
    id?: string | undefined;
    repo: GiscusRepo;
    repoId: string;
    category?: string | undefined;
    categoryId?: string | undefined;
    mapping: GiscusMapping;
    term?: string | undefined;
    theme?: GiscusTheme | undefined;
    reactionsEnabled?: BooleanString | undefined;
    strict?: BooleanString | undefined;
    emitMetadata?: BooleanString | undefined;
    inputPosition?: GiscusInputPosition | undefined;
    lang?: GiscusLang | undefined;
    loading?: GiscusLoading | undefined;
}
declare const _default: vue.DefineComponent<{
    /**
     * Whether the component is in darkmode
     *
     * 组件是否处于夜间模式
     */
    darkmode: BooleanConstructor;
}, () => VNode, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    /**
     * Whether the component is in darkmode
     *
     * 组件是否处于夜间模式
     */
    darkmode: BooleanConstructor;
}>>, {
    darkmode: boolean;
}, {}>;

export { GiscusLoading, GiscusProps, _default as default };
