import { usePageFrontmatter, defineClientConfig } from '@vuepress/client';
import { defineComponent, computed, h } from 'vue';
import CommentProvider from 'vuepress-plugin-comment2/provider';

const enableComment = COMMENT_OPTIONS.comment !== false;
const CommentService = defineComponent({
  name: "CommentService",
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
    const enabled = computed(() => {
      return frontmatter.value.comment || enableComment && frontmatter.value.comment !== false;
    });
    return () => h(CommentProvider, {
      darkmode: props.darkmode,
      style: { display: enabled.value ? "block" : "none" }
    });
  }
});
var config = defineClientConfig({
  enhance: ({ app }) => {
    app.component("CommentService", CommentService);
  }
});

export { config as default };
//# sourceMappingURL=config.js.map
