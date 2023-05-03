import { usePageFrontmatter, usePageData, usePageLang, withBase } from '@vuepress/client';
import { defineComponent, ref, computed, onMounted, h } from 'vue';
import { LoadingIcon } from 'vuepress-shared/client';
import '../styles/giscus.scss';

const SUPPORTED_LANGUAGES = [
  "ar",
  "de",
  "gsw",
  "en",
  "es",
  "fa",
  "fr",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt",
  "ro",
  "ru",
  "th",
  "tr",
  "uk",
  "vi",
  "zh-CN",
  "zh-TW"
];
const giscusOptions = COMMENT_OPTIONS;
const enableGiscus = Boolean(
  giscusOptions.repo && giscusOptions.repoId && giscusOptions.category && giscusOptions.categoryId
);
const { repo, repoId, category, categoryId } = giscusOptions;
var Giscus = defineComponent({
  name: "GiscusComment",
  props: {
    /**
     * Whether the component is in darkmode
     *
     * 组件是否处于夜间模式
     */
    darkmode: Boolean
  },
  setup(props) {
    const frontmatter = usePageFrontmatter();
    const page = usePageData();
    const loaded = ref(false);
    const giscusLang = computed(() => {
      const lang = usePageLang().value;
      if (SUPPORTED_LANGUAGES.includes(lang))
        return lang;
      const shortCode = lang.split("-")[0];
      if (SUPPORTED_LANGUAGES.includes(shortCode))
        return shortCode;
      return "en";
    });
    const enableComment = computed(() => {
      if (!enableGiscus)
        return false;
      const pluginConfig = giscusOptions.comment !== false;
      const pageConfig = frontmatter.value.comment;
      return (
        // Enable in page
        Boolean(pageConfig) || // not disabled in anywhere
        pluginConfig !== false && pageConfig !== false
      );
    });
    const config = computed(
      () => ({
        repo,
        repoId,
        category,
        categoryId,
        lang: giscusLang.value,
        theme: props.darkmode ? giscusOptions.darkTheme || "dark" : giscusOptions.lightTheme || "light",
        mapping: giscusOptions.mapping || "pathname",
        term: withBase(page.value.path),
        inputPosition: giscusOptions.inputPosition || "top",
        reactionsEnabled: giscusOptions.reactionsEnabled === false ? "0" : "1",
        strict: giscusOptions.strict === false ? "0" : "1",
        loading: giscusOptions.lazyLoading === false ? "eager" : "lazy",
        emitMetadata: "0"
      })
    );
    onMounted(async () => {
      await import(
        /* webpackChunkName: "giscus" */
        'giscus'
      );
      loaded.value = true;
    });
    return () => h(
      "div",
      {
        class: [
          "giscus-wrapper",
          { "input-top": giscusOptions.inputPosition !== "bottom" }
        ],
        id: "comment",
        style: {
          display: enableComment.value ? "block" : "none"
        }
      },
      loaded.value ? h("giscus-widget", config.value) : h(LoadingIcon)
    );
  }
});

export { SUPPORTED_LANGUAGES, Giscus as default };
//# sourceMappingURL=Giscus.js.map
