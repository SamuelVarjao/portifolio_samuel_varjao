/**
 * Portfólio de Samuel Varjão
 * Comportamento do site: idioma, tema, menu, projetos, animações e formulário.
 * Os textos ficam em i18n.js, os projetos em projects.js e as configurações em config.js.
 */
(function () {
  "use strict";

  const CONFIG = window.SITE_CONFIG;
  const I18N = window.I18N;
  const PROJECTS = window.PROJECTS || [];
  const LANGS = Object.keys(I18N);
  const HTML_LANG = { pt: "pt-BR", en: "en" };

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  let lang = "pt";

  /* ---------- Armazenamento seguro (pode falhar em modo privado) ---------- */
  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* sem persistência */ }
    },
  };

  /* ---------- Tradução ---------- */

  // Busca um texto pela chave ("hero.lead") no idioma atual, com fallback para o português.
  function t(key, vars) {
    const find = (dict) => key.split(".").reduce((obj, part) => (obj == null ? obj : obj[part]), dict);
    let value = find(I18N[lang]);
    if (value == null) value = find(I18N.pt);
    if (value == null) return key;
    if (vars) value = value.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m));
    return value;
  }

  // Ordem de prioridade: ?lang= na URL → escolha salva → idioma do navegador → português.
  function detectLanguage() {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (LANGS.includes(fromUrl)) return fromUrl;
    const saved = storage.get(CONFIG.storageKeys.lang);
    if (LANGS.includes(saved)) return saved;
    const browser = ((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase();
    return browser.startsWith("en") ? "en" : "pt";
  }

  function setMeta(selector, value) {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute("content", value);
  }

  function applyLanguage(next) {
    lang = LANGS.includes(next) ? next : "pt";
    root.setAttribute("lang", HTML_LANG[lang] || lang);

    // Textos simples: <el data-i18n="chave">
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });

    // Títulos animados palavra por palavra
    $$("[data-split]").forEach(splitWords);

    // Atributos: <el data-i18n-attr="aria-label:chave; placeholder:outra.chave">
    $$("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    // SEO / Open Graph
    document.title = t("meta.title");
    setMeta('meta[name="description"]', t("meta.description"));
    setMeta('meta[property="og:title"]', t("meta.title"));
    setMeta('meta[property="og:description"]', t("meta.description"));
    setMeta('meta[property="og:image:alt"]', t("meta.ogImageAlt"));
    setMeta('meta[property="og:locale"]', t("meta.ogLocale"));
    setMeta('meta[property="og:locale:alternate"]', lang === "pt" ? "en_US" : "pt_BR");
    setMeta('meta[name="twitter:title"]', t("meta.title"));
    setMeta('meta[name="twitter:description"]', t("meta.description"));

    // Botões de idioma
    $$("[data-set-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.setLang === lang));
    });

    translateProjects();
    updateThemeLabel();
    updateMenuLabel();
    updateWhatsApp();
    retranslateFormMessages();
  }

  function initLanguage() {
    applyLanguage(detectLanguage());

    $$("[data-set-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.setLang;
        if (next === lang) return;
        storage.set(CONFIG.storageKeys.lang, next);
        // Remove ?lang= da URL para a escolha salva valer a partir de agora.
        const url = new URL(window.location.href);
        if (url.searchParams.has("lang")) {
          url.searchParams.delete("lang");
          history.replaceState(null, "", url.pathname + url.search + url.hash);
        }
        withViewTransition(() => applyLanguage(next));
      });
    });
  }

  /* ---------- Animações: utilidades ---------- */

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Envolve cada palavra em <span class="word"><span class="word-inner">, para
  // que o CSS possa fazer as palavras "subirem" de dentro de uma máscara.
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach((word, i) => {
      const outer = document.createElement("span");
      outer.className = "word";
      const inner = document.createElement("span");
      inner.className = "word-inner";
      inner.style.setProperty("--i", i);
      inner.textContent = word;
      outer.append(inner);
      el.append(outer);
      if (i < words.length - 1) el.append(" ");
    });
  }

  // Troca suave (crossfade) usando a View Transitions API, quando disponível.
  function withViewTransition(update, className) {
    if (!document.startViewTransition || reducedMotion.matches) {
      update();
      return;
    }
    if (className) root.classList.add(className);
    const transition = document.startViewTransition(update);
    // Se o navegador pular a transição (ex.: aba em segundo plano), a mudança
    // acontece do mesmo jeito; só ignoramos o aviso.
    transition.ready.catch(() => {});
    transition.finished
      .catch(() => {})
      .then(() => { if (className) root.classList.remove(className); });
  }

  /* ---------- Tema claro / escuro ---------- */

  // O tema claro é o padrão; o escuro só vale quando escolhido no botão.
  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateThemeLabel() {
    const btn = $("#theme-toggle");
    const label = currentTheme() === "dark" ? t("a11y.themeToLight") : t("a11y.themeToDark");
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  }

  function initTheme() {
    const btn = $("#theme-toggle");
    // Guarda o tema escolhido na hora do clique (a troca visual acontece um
    // quadro depois, dentro da transição), para cliques rápidos não se perderem.
    let theme = currentTheme();
    btn.addEventListener("click", () => {
      const next = theme === "dark" ? "light" : "dark";
      theme = next;

      // O novo tema se expande em círculo a partir do centro do botão.
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.style.setProperty("--vt-x", x + "px");
      root.style.setProperty("--vt-y", y + "px");
      root.style.setProperty("--vt-r", radius + "px");

      // Aplica sempre a escolha mais recente (uma transição nova cancela a anterior).
      withViewTransition(() => {
        root.setAttribute("data-theme", theme);
        setMeta('meta[name="theme-color"]', theme === "dark" ? "#121410" : "#fbfaf3");
        updateThemeLabel();
      }, "vt-theme");
      storage.set(CONFIG.storageKeys.theme, next);
    });
    if (currentTheme() === "dark") setMeta('meta[name="theme-color"]', "#121410");
  }

  /* ---------- Menu mobile ---------- */

  const desktopQuery = window.matchMedia("(min-width: 900px)");

  function isMenuOpen() {
    return $("#menu-toggle").getAttribute("aria-expanded") === "true";
  }

  function updateMenuLabel() {
    $("#menu-toggle").setAttribute("aria-label", isMenuOpen() ? t("a11y.menuClose") : t("a11y.menuOpen"));
  }

  function setMenu(open, { focusToggle = false } = {}) {
    const toggle = $("#menu-toggle");
    toggle.setAttribute("aria-expanded", String(open));
    $("#site-nav").classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    updateMenuLabel();
    if (open) {
      const first = $("#site-nav a");
      if (first) setTimeout(() => first.focus(), 50);
    } else if (focusToggle) {
      toggle.focus();
    }
  }

  function initMenu() {
    $("#menu-toggle").addEventListener("click", () => setMenu(!isMenuOpen()));
    $$("#site-nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen()) setMenu(false, { focusToggle: true });
    });
    desktopQuery.addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Efeitos ligados à rolagem ----------
     Um único loop (no máximo 1 vez por quadro) cuida de: borda do topo,
     barra de progresso, parallax do hero e linha do tempo. Primeiro lê as
     medidas, depois escreve os estilos, para não forçar layout à toa. */

  function initScrollEffects() {
    const header = $(".site-header");
    const bar = $("#scroll-progress");
    const hero = $(".hero");
    const heroBg = $(".hero-bg");
    const heroContent = $(".hero-content");
    const heroPanel = $(".hero-panel");
    const timeline = $(".timeline");
    const timelineItems = $$(".timeline-item");
    let ticking = false;

    function update() {
      ticking = false;
      const motion = !reducedMotion.matches;

      // Leituras
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const heroHeight = hero.offsetHeight;
      const tl = timeline.getBoundingClientRect();
      const itemTops = timelineItems.map((item) => item.getBoundingClientRect().top);

      // Escritas
      header.classList.toggle("is-scrolled", y > 8);
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ")";

      if (motion && y < heroHeight) {
        heroBg.style.translate = "0 " + (y * 0.35).toFixed(1) + "px";
        heroPanel.style.translate = "0 " + (y * -0.08).toFixed(1) + "px";
        heroContent.style.translate = "0 " + (y * 0.12).toFixed(1) + "px";
        heroContent.style.opacity = Math.max(0.15, 1 - y / (heroHeight * 0.9)).toFixed(3);
      }

      // A linha se desenha até o ponto que passa de 70% da altura da tela.
      // No fim da página tudo fica completo, mesmo que a linha não alcance.
      const line = vh * 0.7;
      const done = !motion || y >= max - 4;
      const progress = done ? 1 : Math.min(1, Math.max(0, (line - tl.top) / tl.height));
      timeline.style.setProperty("--progress", progress.toFixed(4));
      timelineItems.forEach((item, i) => item.classList.toggle("is-active", done || itemTops[i] < line));
    }

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    reducedMotion.addEventListener("change", () => {
      [heroBg, heroPanel, heroContent].forEach((el) => { el.style.translate = ""; el.style.opacity = ""; });
      requestUpdate();
    });
  }

  /* ---------- Topo: link ativo ---------- */

  function initHeader() {
    if (!("IntersectionObserver" in window)) return;
    const links = $$(".nav-link");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          if (link.getAttribute("href") === "#" + id) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((section) => spy.observe(section));
  }

  /* ---------- Projetos ---------- */

  // Gera uma cor estável a partir do nome (usada na capa provisória).
  function hueFromText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) % 360;
    return hash;
  }

  function initials(name) {
    return name.split(/\s+/).filter((w) => w.length > 2 || /^[A-Z]/.test(w)).slice(0, 2)
      .map((w) => w[0].toUpperCase()).join("");
  }

  function el(tag, className, attrs) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }

  // Monta os cards uma única vez; os textos são preenchidos por translateProjects().
  function renderProjects() {
    const grid = $("#projects-grid");
    const fragment = document.createDocumentFragment();

    PROJECTS.forEach((project, index) => {
      const li = el("li", "reveal");
      li.style.setProperty("--delay", (index % 3) * 0.1 + "s");

      const card = el("article", "project-card");
      const cover = el("div", "project-cover");

      if (project.image) {
        const img = el("img", "", {
          src: project.image,
          width: "800",
          height: "500",
          loading: "lazy",
          decoding: "async",
          "data-p": "alt",
        });
        cover.append(img);
      } else {
        // Capa provisória: troque adicionando "image" no projects.js.
        const placeholder = el("div", "cover-placeholder", { role: "img", "data-p": "alt" });
        placeholder.style.setProperty("--hue", hueFromText(project.name));
        placeholder.textContent = initials(project.name);
        cover.append(placeholder);
      }

      const number = el("span", "project-index", { "aria-hidden": "true" });
      number.textContent = String(index + 1).padStart(2, "0");
      cover.append(number);

      const body = el("div", "project-body");
      const type = el("p", "project-type", { "data-p": "type" });
      const name = el("h3", "project-name");
      name.textContent = project.name;
      const desc = el("p", "project-desc", { "data-p": "description" });

      const chips = el("ul", "chips", { "data-p": "tech" });
      (project.tech || []).forEach((tech) => {
        const chip = el("li");
        chip.textContent = tech;
        chips.append(chip);
      });

      const link = el("a", "project-link", { href: project.url, target: "_blank", rel: "noopener noreferrer" });
      const linkText = el("span", "", { "data-p": "link" });
      const srText = el("span", "sr-only", { "data-p": "link-sr" });
      const arrow = el("span", "arrow", { "aria-hidden": "true" });
      arrow.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></svg>';
      link.append(linkText, srText, arrow);

      body.append(type, name, desc, chips, link);
      card.append(cover, body);
      li.append(card);
      fragment.append(li);
    });

    grid.append(fragment);
  }

  function translateProjects() {
    const cards = $$("#projects-grid > li");
    cards.forEach((li, index) => {
      const project = PROJECTS[index];
      const pick = (field) => (project[field] && (project[field][lang] || project[field].pt)) || "";
      const alt = t("projects.coverAlt", { name: project.name });

      const media = $('[data-p="alt"]', li);
      if (media.tagName === "IMG") media.setAttribute("alt", alt);
      else media.setAttribute("aria-label", alt);

      $('[data-p="type"]', li).textContent = pick("type");
      $('[data-p="description"]', li).textContent = pick("description");
      $('[data-p="tech"]', li).setAttribute("aria-label", t("projects.techLabel"));
      $('[data-p="link"]', li).textContent = t("projects.viewSite");
      $('[data-p="link-sr"]', li).textContent = " " + project.name + " " + t("a11y.newTab");
    });
  }

  /* ---------- Animações ao rolar ---------- */

  function initReveal() {
    const items = $$(".reveal");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    // Atraso em cascata para itens lado a lado nas grades.
    $$(".services-grid").forEach((grid) => {
      Array.from(grid.children).forEach((child, i) => child.style.setProperty("--delay", (i % 3) * 0.1 + "s"));
    });
    $$(".tech-grid").forEach((grid) => {
      Array.from(grid.children).forEach((child, i) => child.style.setProperty("--delay", i * 0.07 + "s"));
    });
    $(".contact-form").style.setProperty("--delay", ".15s");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        // Depois da entrada, zera o atraso em cascata para o hover responder na hora.
        setTimeout(() => entry.target.style.setProperty("--delay", "0s"), 2000);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    items.forEach((item) => observer.observe(item));
  }

  /* ---------- Contato: e-mail e WhatsApp ---------- */

  function initContactLinks() {
    const email = $("#contact-email");
    email.href = "mailto:" + CONFIG.email;
    email.textContent = CONFIG.email;
  }

  // Monta o link do WhatsApp (com mensagem no idioma atual) para o botão do
  // contato e para todos os links marcados com data-whatsapp ("Falar comigo").
  function updateWhatsApp() {
    const button = $("#whatsapp-link");
    const number = String(CONFIG.whatsapp || "").replace(/\D/g, "");
    const shortcuts = $$("[data-whatsapp]");

    if (!number) {
      button.hidden = true;
      shortcuts.forEach((a) => {
        a.href = "#contato";
        a.removeAttribute("target");
        a.removeAttribute("rel");
      });
      return;
    }

    const href = "https://wa.me/" + number + "?text=" + encodeURIComponent(t("contact.whatsappMessage"));
    button.href = href;
    button.hidden = false;
    shortcuts.forEach((a) => {
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
  }

  /* ---------- Formulário ---------- */

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validators = {
    name: (v) => (v.trim().length < 2 ? "nameRequired" : ""),
    email: (v) => (!v.trim() ? "emailRequired" : !EMAIL_RE.test(v.trim()) ? "emailInvalid" : ""),
    message: (v) => (!v.trim() ? "messageRequired" : v.trim().length < 10 ? "messageShort" : ""),
  };

  function showFieldError(input, errorKey) {
    const error = document.getElementById(input.id + "-error");
    if (errorKey) {
      input.setAttribute("aria-invalid", "true");
      error.dataset.key = errorKey;
      error.textContent = t("form.errors." + errorKey);
    } else {
      input.removeAttribute("aria-invalid");
      delete error.dataset.key;
      error.textContent = "";
    }
  }

  function validateField(input) {
    const errorKey = validators[input.name] ? validators[input.name](input.value) : "";
    showFieldError(input, errorKey);
    return !errorKey;
  }

  function setStatus(key, type, vars) {
    const status = $("#form-status");
    status.className = "form-status" + (type ? " is-" + type : "");
    if (!key) {
      status.textContent = "";
      delete status.dataset.key;
      return;
    }
    status.dataset.key = key;
    status.dataset.vars = vars ? JSON.stringify(vars) : "";
    status.textContent = t(key, vars);
  }

  // Ao trocar de idioma, mensagens já exibidas também mudam.
  function retranslateFormMessages() {
    $$(".field-error[data-key]").forEach((error) => {
      error.textContent = t("form.errors." + error.dataset.key);
    });
    const status = $("#form-status");
    if (status && status.dataset.key) {
      const vars = status.dataset.vars ? JSON.parse(status.dataset.vars) : undefined;
      status.textContent = t(status.dataset.key, vars);
    }
  }

  function openMailto(data) {
    const body = data.message + "\n\n" + data.name + " <" + data.email + ">";
    window.location.href = "mailto:" + CONFIG.email +
      "?subject=" + encodeURIComponent(t("form.subject")) +
      "&body=" + encodeURIComponent(body);
  }

  function initForm() {
    const form = $("#contact-form");
    const submit = $("#form-submit");
    const fields = $$("input[name]:not([name='_gotcha']), textarea[name]", form);
    let attempted = false;

    fields.forEach((input) => {
      input.addEventListener("input", () => { if (attempted) validateField(input); });
      input.addEventListener("blur", () => { if (attempted) validateField(input); });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      attempted = true;

      const invalid = fields.filter((input) => !validateField(input));
      if (invalid.length) {
        setStatus("form.invalidSummary", "error");
        invalid[0].focus();
        return;
      }

      // Bot preencheu o campo invisível: finge sucesso e não envia.
      if (form.elements._gotcha.value) {
        form.reset();
        setStatus("form.success", "success");
        return;
      }

      const data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.message.value.trim(),
      };

      // Sem Formspree configurado: abre o app de e-mail do visitante.
      if (!CONFIG.formspreeId) {
        setStatus("form.mailtoFallback", "success");
        openMailto(data);
        return;
      }

      submit.disabled = true;
      submit.setAttribute("aria-busy", "true");
      setStatus("form.sending", "");

      try {
        const payload = new FormData(form);
        payload.append("_subject", t("form.subject"));
        payload.append("_language", lang);
        const response = await fetch("https://formspree.io/f/" + encodeURIComponent(CONFIG.formspreeId), {
          method: "POST",
          body: payload,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("HTTP " + response.status);
        form.reset();
        attempted = false;
        setStatus("form.success", "success");
      } catch (err) {
        setStatus("form.error", "error", { email: CONFIG.email });
      } finally {
        submit.disabled = false;
        submit.removeAttribute("aria-busy");
      }
    });
  }

  /* ---------- Rodapé ---------- */

  function initFooter() {
    $("#year").textContent = String(new Date().getFullYear());
  }

  /* ---------- Início ---------- */

  renderProjects();
  initContactLinks();
  initTheme();
  initMenu();
  initForm();
  initFooter();
  initLanguage();
  initHeader();
  initScrollEffects();
  initReveal();

  // Textos aplicados: libera a exibição da página (ver .is-ready no CSS).
  root.classList.add("is-ready");
})();
