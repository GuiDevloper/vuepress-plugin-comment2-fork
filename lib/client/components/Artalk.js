import { usePageFrontmatter, usePageData, useSiteData } from '@vuepress/client';
import { defineComponent, shallowRef, computed, onMounted, watch, h, nextTick } from 'vue';
import 'artalk/dist/Artalk.css';
import '../styles/artalk.scss';

const artalkOptions = COMMENT_OPTIONS;
const enableArtalk = Boolean(artalkOptions.server);
var Artalk = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Artalk",
  props: {
    /**
     * Whether the component is in darkmode
     *
     * 组件是否处于夜间模式
     */
    darkmode: Boolean
  },
  setup: (props) => {
    const frontmatter = usePageFrontmatter();
    const page = usePageData();
    const site = useSiteData();
    const artalkContainer = shallowRef();
    let artalk = null;
    const enableComment = computed(() => {
      if (!enableArtalk)
        return false;
      const pluginConfig = artalkOptions.comment !== false;
      const pageConfig = frontmatter.value.comment;
      return (
        // Enable in page
        Boolean(pageConfig) || // not disabled in anywhere
        pluginConfig !== false && pageConfig !== false
      );
    });
    const initArtalk = async () => {
      if (enableComment.value)
        await Promise.all([
          import(
            /* webpackChunkName: "artalk" */
            'artalk'
          ),
          new Promise((resolve) => {
            setTimeout(() => {
              void nextTick().then(resolve);
            }, artalkOptions.delay || 800);
          })
        ]).then(([{ default: _Artalk }]) => {
          const Artalk = _Artalk;
          try {
            artalk = new Artalk({
              useBackendConf: false,
              site: site.value.title,
              pageTitle: page.value.title,
              ...artalkOptions,
              el: artalkContainer.value,
              pageKey: page.value.path,
              darkMode: props.darkmode
            });
            if (artalkOptions.useBackendConf)
              artalk.on("conf-loaded", () => {
                artalk.setDarkMode(props.darkmode);
              });
          } catch (err) {
          }
        });
    };
    onMounted(() => {
      watch(
        () => [enableComment.value, page.value.path],
        async () => {
          artalk == null ? void 0 : artalk.destroy();
          await initArtalk();
        },
        { immediate: true }
      );
      watch(
        () => props.darkmode,
        (value) => {
          artalk == null ? void 0 : artalk.setDarkMode(value);
        }
      );
    });
    return () => enableComment.value ? h(
      "div",
      { class: "artalk-wrapper" },
      h("div", { ref: artalkContainer })
    ) : null;
  }
});

export { Artalk as default };
//# sourceMappingURL=Artalk.js.map
