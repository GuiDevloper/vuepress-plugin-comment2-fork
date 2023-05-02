import { usePageFrontmatter, usePageLang, usePageData } from '@vuepress/client';
import { defineComponent, ref, computed, onMounted, watch, h, nextTick } from 'vue';
import { LoadingIcon } from 'vuepress-shared/client';
import '../styles/twikoo.scss';

const twikooOption = COMMENT_OPTIONS;
const enableTwikoo = Boolean(twikooOption.envId);
var Twikoo = defineComponent({
  name: "TwikooComment",
  setup() {
    const frontmatter = usePageFrontmatter();
    const lang = usePageLang();
    const page = usePageData();
    const loaded = ref(false);
    const enableComment = computed(() => {
      if (!enableTwikoo)
        return false;
      const pluginConfig = twikooOption.comment !== false;
      const pageConfig = frontmatter.value.comment;
      return (
        // Enable in page
        Boolean(pageConfig) || // not disabled in anywhere
        pluginConfig !== false && pageConfig !== false
      );
    });
    const initTwikoo = async () => {
      if (enableComment.value) {
        const [{ init }] = await Promise.all([
          import(
            /* webpackChunkName: "twikoo" */
            'twikoo'
          ),
          new Promise((resolve) => {
            setTimeout(() => {
              void nextTick().then(resolve);
            }, twikooOption.delay || 800);
          })
        ]);
        loaded.value = true;
        await init({
          lang: lang.value === "zh-CN" ? "zh-CN" : "en",
          ...twikooOption,
          el: "#twikoo-comment"
        });
      }
    };
    onMounted(() => {
      watch(
        () => [enableComment.value, page.value.path],
        () => initTwikoo(),
        { immediate: true }
      );
    });
    return () => h(
      "div",
      {
        class: "twikoo-wrapper",
        id: "comment",
        style: { display: enableComment.value ? "block" : "none" }
      },
      loaded.value ? h("div", { id: "twikoo-comment" }) : h(LoadingIcon)
    );
  }
});

export { Twikoo as default };
//# sourceMappingURL=Twikoo.js.map
