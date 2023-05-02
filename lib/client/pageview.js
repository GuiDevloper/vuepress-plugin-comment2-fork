import { pageviewCount } from '@waline/client/dist/pageview.mjs';

const updatePageview = () => pageviewCount({
  serverURL: COMMENT_OPTIONS.serverURL
});

export { updatePageview };
//# sourceMappingURL=pageview.js.map
