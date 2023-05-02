import { getDirname, path, colors } from '@vuepress/utils';
import { useSassPalettePlugin } from 'vuepress-plugin-sass-palette';
import { ensureEndingSlash, Logger, noopModule, checkVersion, getLocales, addViteOptimizeDepsInclude, addViteSsrExternal, addViteOptimizeDepsExclude, addCustomElement } from 'vuepress-shared/node';

const walineLocales = {
  "/en/": {
    placeholder: "Write a comment here (Fill in the email address to receive an email notification when being replied)"
  },
  "/zh/": {
    placeholder: "请留言。(填写邮箱可在被回复时收到邮件提醒)"
  },
  "/zh-tw/": {
    placeholder: "請留言。(填寫信箱可在被回覆時收到郵件提醒)"
  },
  "/de/": {
    placeholder: "Schreibe ein Kommentar (Geben Sie die E-Mail-Adresse ein, um eine E-Mail-Benachrichtigung zu erhalten, wenn Sie eine Antwort erhalten)"
  },
  "/de-at/": {
    placeholder: "Schreibe ein Kommentar (Geben Sie die E-Mail-Adresse ein, um eine E-Mail-Benachrichtigung zu erhalten, wenn Sie eine Antwort erhalten)"
  },
  "/vi/": {
    placeholder: "Để lại bình luận (Điền địa chỉ email để nhận email thông báo khi được trả lời)"
  },
  "/uk/": {
    placeholder: "Напишіть тут коментар (введіть адресу електронної пошти, щоб отримувати сповіщення електронною поштою, коли буде відповідь)"
  },
  "/ru/": {
    placeholder: "Напишите комментарий здесь (Введите адрес электронной почты, чтобы получить уведомление по электронной почте при ответе)"
  },
  "/br/": {
    placeholder: "Escreva um comentário aqui (preencha com o endereço de email para receber notificações quando tiver alguma resposta)"
  },
  "/pl/": {
    placeholder: "Wpisz tutaj komentarz (wpisz adres e-mail, aby otrzymać powiadomienie e-mail, gdy otrzymasz odpowiedź)"
  },
  "/sk/": {
    placeholder: "Napíš svoj komentár (vlož svoj e-mail taktiež, aby si bol notifikovaný o odpovediach)"
  },
  "/fr/": {
    placeholder: "Écrivez votre commentaire ici (Inscrivez votre email afin de recevoir une notification en cas de réponse)"
  },
  "/es/": {
    placeholder: "Escriba un comentario aquí (Ingrese su correo electrónico para recibir una notificación en caso de respuesta)"
  },
  "/ja/": {
    placeholder: "伝言をどうぞ (メールアドレスを入力すると、返信があった際にメールでお知らせします。)"
  },
  "/tr/": {
    placeholder: "Buraya bir yorum yazın (Yanıtlandığında bir e-posta bildirimi almak için e-posta adresinizi girin)"
  },
  "/ko/": {
    placeholder: "댓글을 남겨주세요 (답글이 달렸을 때 이메일로 알림을 받으려면 이메일 주소를 입력하세요)"
  },
  "/fi/": {
    placeholder: "Kirjoita kommentti tähän (täytä sähköpostiosoite saadaksesi sähköposti-ilmoituksen vastauksesta)"
  },
  "/hu/": {
    placeholder: "Írj kommentet itt! (Töltsd ki az email címet, hogy értesítést kapj, amikor válaszolnak.)"
  },
  "/id/": {
    placeholder: "Tulis komentar di sini (Isi alamat email untuk menerima notifikasi jika komentar kamu telah dibalas orang lain)"
  },
  "/nl/": {
    placeholder: "Schrijf een opmerking hier (Vul je emailadres in om een email-notificatie te ontvangen wanneer er gereageerd wordt."
  }
};

const __dirname$1 = getDirname(import.meta.url);
const CLIENT_FOLDER = ensureEndingSlash(
  path.resolve(__dirname$1, "../client")
);
const COMMENT_PROVIDERS = ["Artalk", "Giscus", "Waline", "Twikoo"];
const PLUGIN_NAME = "vuepress-plugin-comment2";
const logger = new Logger(PLUGIN_NAME);

const getProvider = (provider = "None") => {
  if (COMMENT_PROVIDERS.includes(provider))
    return `${CLIENT_FOLDER}components/${provider}.js`;
  if (provider !== "None")
    logger.error(`Invalid provider: ${provider}`);
  return noopModule;
};

const convertOptions = (options) => {
  if ("type" in options) {
    logger.warn(`"type" is deprecated, please use "provider".`);
    if (options["type"] === "waline")
      options.provider = "Waline";
    else if (options["type"] === "giscus")
      options.provider = "Giscus";
    else if (options["type"] === "twikoo")
      options.provider = "Twikoo";
    delete options["type"];
  }
  if (options.provider === "Waline") {
    [
      // valine
      ["emojiCDN", "emoji"],
      ["emojiMaps", "emoji"],
      ["requiredFields", "requiredMeta"],
      ["visitor", "pageview"],
      ["langMode", "locale"],
      ["placeholder", "locale.placeholder"],
      // waline v1
      ["anonymous", "login"],
      ["copyRight", "copyright"]
    ].forEach(([oldOptions, newOptions]) => {
      if (oldOptions in options) {
        logger.warn(
          `"${oldOptions}" is deprecated in @waline/client@v2, you should use "${newOptions}" instead.`
        );
        delete options[oldOptions];
      }
    });
    [
      // valine
      "region",
      "appId",
      "appKey",
      "notify",
      "verify",
      "avatar",
      "avatarForce",
      "enableQQ",
      "recordIP",
      "serverURLs",
      // waline v1
      "avatarCDN",
      "mathTagSupport",
      "highlight",
      "uploadImage",
      "previewMath"
    ].forEach((option) => {
      if (option in options) {
        logger.error(
          `"${option}" is no longer supported in @waline/client@v2.`
        );
        delete options[option];
      }
    });
  }
};

const applyDemo = (options, app) => {
  const { isDev } = app.env;
  options.provider = options.provider && COMMENT_PROVIDERS.includes(options.provider) ? options.provider : "None";
  switch (options.provider) {
    case "Artalk":
      if (!options.server)
        if (isDev) {
          logger.info(
            `A fallback Artalk server is used ${colors.red(
              "for demo only"
            )}. You should provide ${colors.magenta(
              "server"
            )} option yourself in production.`
          );
          options.site = "artalk-demo";
          options.server = "https://demo-artalk.jjdxb.top/";
        } else {
          logger.error(`${colors.magenta("site")} is required for Artalk.`);
        }
      break;
    case "Giscus":
      if (!options.repo && !options.repoId && !options.category && !options.categoryId && isDev) {
        logger.info(
          `A fallback GitHub repo is used ${colors.red(
            "for demo only"
          )}. You should provide ${colors.magenta("repo")}, ${colors.magenta(
            "repoId"
          )}, ${colors.magenta("category")} and ${colors.magenta(
            "categoryId"
          )} option yourself in production.`
        );
        options.repo = "vuepress-theme-hope/giscus-discussions";
        options.repoId = "R_kgDOG_Pt2A";
        options.category = "Announcements";
        options.categoryId = "DIC_kwDOG_Pt2M4COD69";
      } else {
        if (!options.repo)
          logger.error(`${colors.magenta("repo")} is required for Giscus.`);
        if (!options.repoId)
          logger.error(`${colors.magenta("repoId")} is required for Giscus.`);
        if (!options.category)
          logger.error(`${colors.magenta("category")} is required for Giscus.`);
        if (!options.categoryId)
          logger.error(
            `${colors.magenta("categoryId")} is required for Giscus.`
          );
      }
      break;
    case "Waline":
      if (!options.serverURL)
        if (isDev) {
          options.serverURL = "https://waline-comment.vuejs.press";
          logger.info(
            `A fallback Waline server is used ${colors.red(
              "for demo only"
            )}. You should provide ${colors.magenta(
              "serverURL"
            )} option yourself in production.`
          );
        } else {
          logger.error(
            `${colors.magenta("serverURL")} is required for Waline.`
          );
        }
      break;
    case "Twikoo":
      if (!options.envId)
        if (isDev) {
          logger.info(
            `A fallback Twikoo server is used ${colors.red(
              "for demo only"
            )}. You should provide ${colors.magenta(
              "envId"
            )} option yourself in production.`
          );
          options.envId = "https://twikoo.ccknbc.vercel.app";
        } else {
          logger.error(`${colors.magenta("envId")} is required for Twikoo.`);
        }
      break;
  }
};

const __dirname = getDirname(import.meta.url);
const commentPlugin = (options, legacy = true) => (app) => {
  if (legacy)
    convertOptions(options);
  checkVersion(app, PLUGIN_NAME, "2.0.0-beta.61");
  if (app.env.isDebug)
    logger.info("Options:", options);
  applyDemo(options, app);
  const userWalineLocales = options.provider === "Waline" ? getLocales({
    app,
    name: "waline",
    default: walineLocales,
    config: options.locales
  }) : {};
  if (options.provider === "Waline" && "locales" in options)
    delete options.locales;
  useSassPalettePlugin(app, { id: "hope" });
  return {
    name: PLUGIN_NAME,
    alias: {
      [`${PLUGIN_NAME}/provider`]: getProvider(options.provider)
    },
    define: () => ({
      COMMENT_OPTIONS: options,
      ...options.provider === "Waline" ? {
        WALINE_LOCALES: userWalineLocales,
        WALINE_META: options.metaIcon !== false
      } : {}
    }),
    extendsBundlerOptions: (bundlerOptions, app2) => {
      switch (options.provider) {
        case "Artalk": {
          addViteOptimizeDepsInclude(bundlerOptions, app2, "artalk");
          addViteSsrExternal(bundlerOptions, app2, "artalk");
          break;
        }
        case "Giscus": {
          addCustomElement(bundlerOptions, app2, "GiscusWidget");
          addViteSsrExternal(bundlerOptions, app2, "giscus");
          break;
        }
        case "Waline": {
          addViteOptimizeDepsInclude(bundlerOptions, app2, "autosize");
          addViteOptimizeDepsExclude(bundlerOptions, app2, "@waline/client");
          addViteSsrExternal(bundlerOptions, app2, "@waline/client");
          break;
        }
        case "Twikoo": {
          addViteOptimizeDepsInclude(bundlerOptions, app2, "twikoo");
          addViteSsrExternal(bundlerOptions, app2, "twikoo");
          break;
        }
      }
    },
    clientConfigFile: path.resolve(__dirname, "../client/config.js")
  };
};

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

export { SUPPORTED_LANGUAGES, commentPlugin, walineLocales };
//# sourceMappingURL=index.js.map
