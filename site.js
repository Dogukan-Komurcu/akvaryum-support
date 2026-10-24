(() => {
  "use strict";
  const config = window.AKVARYUM_SITE || {};
  const url = new URL(window.location.href);
  const requested = url.searchParams.get("lang");
  let language = requested === "en" || requested === "tr"
    ? requested : (navigator.language || "tr").toLowerCase().startsWith("tr") ? "tr" : "en";
  const titles = {
    home: { tr: "Akvaryum — Kendi küçük su dünyan", en: "Akvaryum — Your own little water world" },
    support: { tr: "Akvaryum — Destek", en: "Akvaryum — Support" },
    privacy: { tr: "Akvaryum — Gizlilik politikası", en: "Akvaryum — Privacy policy" }
  };
  function setLanguage(next, updateUrl) {
    language = next;
    document.documentElement.dataset.language = language;
    document.documentElement.lang = language;
    document.querySelectorAll("[data-language-choice]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.languageChoice === language));
    });
    document.querySelectorAll("a[data-local-link]").forEach(link => {
      const target = new URL(link.getAttribute("href"), window.location.href);
      target.searchParams.set("lang", language);
      link.setAttribute("href", target.pathname.split("/").pop() + target.search + target.hash);
    });
    const page = titles[document.body.dataset.page];
    if (page) document.title = page[language];
    if (updateUrl) {
      const current = new URL(window.location.href);
      current.searchParams.set("lang", language);
      window.history.replaceState(null, "", current);
    }
  }
  document.querySelectorAll("[data-language-choice]").forEach(button => {
    button.hidden = false;
    button.addEventListener("click", () => setLanguage(button.dataset.languageChoice, true));
  });
  document.querySelectorAll("[data-draft-banner]").forEach(el => { el.hidden = config.showDraftBanner !== true; });
  document.querySelectorAll("a[data-store-link]").forEach(link => {
    const enabled = config.storefrontLive === true && /^https:\/\/apps\.apple\.com\//.test(config.appStoreUrl || "");
    link.hidden = !enabled;
    if (enabled) link.href = config.appStoreUrl;
    else link.removeAttribute("href");
  });
  setLanguage(language, false);
})();
