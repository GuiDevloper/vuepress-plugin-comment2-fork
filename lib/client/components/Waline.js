import { usePageData, usePageFrontmatter, usePageLang, withBase } from '@vuepress/client';
import { pageviewCount } from '@waline/client/dist/pageview.mjs';
export { pageviewCount } from '@waline/client/dist/pageview.mjs';
import { defineComponent, computed, onMounted, watch, nextTick, h, defineAsyncComponent } from 'vue';
import { useLocaleConfig, LoadingIcon } from 'vuepress-shared/client';
import '@waline/client/dist/waline.css';
import '../styles/waline.scss';

const walineOption = COMMENT_OPTIONS;
const walineLocales = WALINE_LOCALES;
const enableWaline = Boolean(walineOption.serverURL);
if (WALINE_META)
  import(
    /* webpackChunkName: "waline" */
    '@waline/client/dist/waline-meta.css'
  );
var Waline = defineComponent({
  name: "WalineComment",
  setup() {
    const page = usePageData();
    const frontmatter = usePageFrontmatter();
    const lang = usePageLang();
    const walineLocale = useLocaleConfig(walineLocales);
    let abort;
    const enableComment = computed(() => {
      if (!enableWaline)
        return false;
      const pluginConfig = walineOption.comment !== false;
      const pageConfig = frontmatter.value.comment;
      return (
        // Enable in page
        Boolean(pageConfig) || // not disabled in anywhere
        pluginConfig !== false && pageConfig !== false
      );
    });
    const enablePageViews = computed(() => {
      if (!enableWaline)
        return false;
      const pluginConfig = walineOption.pageview !== false;
      const pageConfig = frontmatter.value.pageview;
      return (
        // Enable in page
        Boolean(pageConfig) || // not disabled in anywhere
        pluginConfig !== false && pageConfig !== false
      );
    });
    const walineKey = computed(() => withBase(page.value.path));
    const walineProps = computed(() => ({
      lang: lang.value === "zh-CN" ? "zh-CN" : "en",
      locale: walineLocale.value,
      dark: "html.dark",
      ...walineOption,
      path: walineKey.value
    }));
    onMounted(() => {
      watch(
        walineKey,
        () => {
          abort == null ? void 0 : abort();
          if (enablePageViews.value)
            void nextTick().then(() => {
              setTimeout(() => {
                abort = pageviewCount({
                  serverURL: walineOption.serverURL,
                  path: walineKey.value
                });
              }, walineOption.delay || 800);
            });
        },
        { immediate: true }
      );
    });
    return () => enableComment.value ? h(
      "div",
      { class: "waline-wrapper", id: "comment" },
      enableWaline ? h(
        defineAsyncComponent({
          loader: async () => (await import(
            /* webpackChunkName: "waline" */
            '@waline/client/dist/component.mjs'
          )).Waline,
          loadingComponent: LoadingIcon
        }),
        walineProps.value
      ) : []
    ) : null;
  }
});

export { Waline as default };
//# sourceMappingURL=Waline.js.map
