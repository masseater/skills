export const FONTS =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+JP:wght@400;500;600;700&display=swap";

export const LIGHT = `
  --bg: #ffffff;
  --side: #f6f8f8;
  --fg: #182121;
  --muted: #5b6868;
  --line: #e0e6e6;
  --soft: #eff3f3;
  --accent: #0d6a66;
  --note: #1f5fae;
  --tip: #1c7745;
  --important: #0d6a66;
  --warning: #8a5800;
  --caution: #b3242d;
  --scrim: rgb(16 24 24 / 0.32);`;

export const DARK = `
  --bg: #121718;
  --side: #161c1d;
  --fg: #e2e9e9;
  --muted: #95a3a3;
  --line: #2a3334;
  --soft: #1c2425;
  --accent: #52bcb4;
  --note: #74a7ea;
  --tip: #5fc58b;
  --important: #52bcb4;
  --warning: #e0b04f;
  --caution: #f07a7f;
  --scrim: rgb(0 0 0 / 0.5);
  color-scheme: dark;`;

export const STYLE = `
:root {${LIGHT}
  --font-body: "IBM Plex Sans JP", "Hiragino Sans", "Noto Sans JP", "Yu Gothic UI", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --topbar: 52px;
  --sidebar: 272px;
  --toc: 224px;
  --top: calc(env(safe-area-inset-top, 0px) + var(--topbar));
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {${DARK} } }
:root[data-theme="dark"] {${DARK} }
*, *::before, *::after { box-sizing: border-box; }
html { scroll-padding-top: calc(var(--top) + 16px); }
body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.8 var(--font-body); -webkit-text-size-adjust: 100%; }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 30; background: var(--bg); }
a { color: var(--accent); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.icon { display: block; flex: none; }

.topbar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 20; height: var(--topbar); display: flex; align-items: center; gap: 8px; padding-left: max(12px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); background: var(--bg); border-bottom: 1px solid var(--line); }
.sidebar-toggle { display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--muted); cursor: pointer; }
.sidebar-toggle:hover { background: var(--soft); color: var(--fg); }
.doc-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--fg); font-size: 15px; font-weight: 600; text-decoration: none; }

.shell { display: grid; grid-template-columns: var(--sidebar) minmax(0, 1fr) var(--toc); transition: grid-template-columns 0.2s ease; }
:root[data-sidebar="closed"] .shell { grid-template-columns: 0 minmax(0, 1fr) var(--toc); }
.sidebar { position: sticky; top: var(--top); height: calc(100dvh - var(--top)); min-width: 0; overflow: hidden auto; padding: 20px 12px 48px max(12px, env(safe-area-inset-left, 0px)); font-size: 14px; line-height: 1.5; }
:root[data-sidebar="closed"] .sidebar { visibility: hidden; }
.nav-group h2 { margin: 20px 8px 6px; color: var(--fg); font-size: 12px; font-weight: 600; letter-spacing: 0.06em; }
.nav-group:first-child h2 { margin-top: 0; }
.sidebar ul { margin: 0; padding: 0; list-style: none; }
.sidebar ul ul { margin: 2px 0 4px 14px; padding-left: 6px; border-left: 1px solid var(--line); }
.sidebar a { display: block; padding: 6px 8px; border-radius: 6px; color: var(--muted); text-decoration: none; }
.sidebar a:hover { background: var(--soft); color: var(--fg); }
.sidebar a[aria-current="page"] { background: color-mix(in oklab, var(--accent) 11%, var(--bg)); color: var(--accent); font-weight: 500; }
.scrim { display: none; }

.main { min-width: 0; padding-block: 28px 72px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.article { max-width: 44rem; margin: 0 auto; }
.breadcrumb { display: flex; flex-wrap: wrap; gap: 4px; margin: 0 0 6px; padding: 0; list-style: none; color: var(--muted); font-size: 13px; line-height: 1.5; }
.breadcrumb li { display: flex; align-items: center; gap: 4px; }
.breadcrumb .icon { width: 14px; height: 14px; }
h1 { margin: 0 0 28px; font-size: 2rem; line-height: 1.35; font-weight: 700; letter-spacing: -0.01em; text-wrap: balance; }
.prose { overflow-wrap: anywhere; }
.prose > :first-child { margin-top: 0; }
.prose h2 { margin: 2.4em 0 0.6em; font-size: 1.4rem; line-height: 1.45; text-wrap: balance; }
.prose h3 { margin: 2em 0 0.5em; font-size: 1.15rem; line-height: 1.5; }
.prose h4, .prose h5, .prose h6 { margin: 1.6em 0 0.4em; font-size: 1rem; }
.prose p, .prose ul, .prose ol { margin: 0 0 1em; }
.prose ul, .prose ol { padding-left: 1.5em; }
.prose li + li, .prose li > ul, .prose li > ol { margin-top: 0.3em; }
.prose li > ul, .prose li > ol { margin-bottom: 0; }
.prose a { text-decoration-thickness: 1px; text-underline-offset: 3px; }
.prose code { padding: 0.1em 0.35em; border-radius: 4px; background: var(--soft); font: 0.88em var(--font-mono); }
.prose img { max-width: 100%; height: auto; border-radius: 6px; }
.prose hr { margin: 2.4em 0; border: 0; border-top: 1px solid var(--line); }
.prose blockquote { margin: 0 0 1em; padding-left: 16px; border-left: 3px solid var(--line); color: var(--muted); }
.code { position: relative; margin: 0 0 1.2em; border: 1px solid var(--line); border-radius: 8px; background: var(--soft); }
.code pre { margin: 0; padding: 14px 16px; overflow-x: auto; font: 13.5px/1.65 var(--font-mono); }
.prose .code code { padding: 0; background: none; font: inherit; }
.code-lang { position: absolute; top: 4px; right: 10px; color: var(--muted); font: 11px/1.6 var(--font-mono); }
.figure { margin: 0 0 1.2em; overflow-x: auto; }
.figure pre.mermaid { margin: 0; background: none; text-align: center; }
.table { margin: 0 0 1.2em; overflow-x: auto; }
.table table { width: 100%; border-collapse: collapse; font-size: 15px; line-height: 1.6; }
.table th, .table td { padding: 8px 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
.table th { border-bottom: 2px solid var(--line); font-weight: 600; white-space: nowrap; }
.table td { font-variant-numeric: tabular-nums; }
.callout { --tone: var(--note); margin: 0 0 1.2em; padding: 12px 16px; border: 1px solid color-mix(in oklab, var(--tone) 28%, var(--bg)); border-radius: 8px; background: color-mix(in oklab, var(--tone) 8%, var(--bg)); }
.callout-tip { --tone: var(--tip); }
.callout-important { --tone: var(--important); }
.callout-warning { --tone: var(--warning); }
.callout-caution { --tone: var(--caution); }
.callout-label { margin: 0 0 2px !important; color: var(--tone); font-size: 13px; font-weight: 600; }
.callout > :last-child { margin-bottom: 0; }

.toc-column { min-width: 0; padding: 28px max(16px, env(safe-area-inset-right, 0px)) 0 8px; }
.toc { position: sticky; top: calc(var(--top) + 28px); max-height: calc(100dvh - var(--top) - 56px); overflow-y: auto; font-size: 13px; line-height: 1.5; }
.toc-label { margin: 0 0 8px; color: var(--fg); font-size: 12px; font-weight: 600; letter-spacing: 0.06em; }
.toc ul, .toc-compact ul { margin: 0; padding: 0; list-style: none; }
.toc ul { border-left: 1px solid var(--line); }
.toc a { display: block; margin-left: -1px; padding: 4px 12px; border-left: 2px solid transparent; color: var(--muted); text-decoration: none; }
.toc .toc-l3 a { padding-left: 24px; }
.toc a:hover { color: var(--fg); }
.toc a[aria-current="true"] { border-left-color: var(--accent); color: var(--accent); }
.toc-compact { display: none; margin: 0 0 28px; padding: 8px 14px; border: 1px solid var(--line); border-radius: 8px; font-size: 14px; }
.toc-compact summary { color: var(--muted); font-weight: 600; cursor: pointer; }
.toc-compact ul { margin-top: 6px; }
.toc-compact a { display: block; padding: 3px 0; color: var(--fg); text-decoration: none; }
.toc-compact .toc-l3 a { padding-left: 14px; color: var(--muted); }

.pager { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--line); }
.pager a { display: flex; flex-direction: column; gap: 2px; min-width: 0; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; text-decoration: none; }
.pager a:hover { border-color: var(--accent); }
.pager-next { grid-column: 2; text-align: right; }
.pager-label { color: var(--muted); font-size: 12px; }
.pager-title { color: var(--accent); font-weight: 600; overflow-wrap: anywhere; }

@media (max-width: 1180px) {
  .shell { grid-template-columns: var(--sidebar) minmax(0, 1fr); }
  :root[data-sidebar="closed"] .shell { grid-template-columns: 0 minmax(0, 1fr); }
  .toc-column { display: none; }
  .toc-compact { display: block; }
}
@media (max-width: 820px) {
  .shell, :root[data-sidebar="closed"] .shell { grid-template-columns: minmax(0, 1fr); }
  .sidebar, :root[data-sidebar="closed"] .sidebar { position: fixed; z-index: 25; top: var(--top); bottom: 0; left: 0; width: min(85vw, 320px); height: auto; padding-bottom: max(48px, env(safe-area-inset-bottom, 0px)); border-right: 1px solid var(--line); background: var(--side); transform: translateX(-100%); visibility: hidden; transition: transform 0.2s ease, visibility 0.2s; }
  :root[data-drawer="open"] .sidebar { transform: none; visibility: visible; }
  :root[data-drawer="open"] .scrim { display: block; position: fixed; z-index: 24; inset: var(--top) 0 0; background: var(--scrim); }
  h1 { font-size: 1.6rem; }
  .pager { grid-template-columns: 1fr; }
  .pager-next { grid-column: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .shell, .sidebar { transition: none !important; }
}
`;

export const SCRIPT = `
(() => {
  const root = document.documentElement;
  const key = "gitbook-pages:sidebar";
  const narrow = matchMedia("(max-width: 820px)");
  try { if (localStorage.getItem(key) === "closed") root.dataset.sidebar = "closed"; } catch {}
  const ready = () => {
    const button = document.querySelector(".sidebar-toggle");
    if (!button) return;
    const sync = () => button.setAttribute("aria-expanded", String(narrow.matches ? root.dataset.drawer === "open" : root.dataset.sidebar !== "closed"));
    const closeDrawer = () => { delete root.dataset.drawer; sync(); };
    sync();
    narrow.addEventListener("change", closeDrawer);
    button.addEventListener("click", () => {
      if (narrow.matches) {
        if (root.dataset.drawer === "open") delete root.dataset.drawer; else root.dataset.drawer = "open";
      } else {
        const closing = root.dataset.sidebar !== "closed";
        if (closing) root.dataset.sidebar = "closed"; else delete root.dataset.sidebar;
        try { localStorage.setItem(key, closing ? "closed" : "open"); } catch {}
      }
      sync();
    });
    document.querySelector(".scrim")?.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && root.dataset.drawer === "open") { closeDrawer(); button.focus(); }
    });
    const links = [...document.querySelectorAll(".toc a")];
    const targets = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter(Boolean);
    if (targets.length === 0) return;
    const update = () => {
      const line = button.getBoundingClientRect().bottom + 40;
      let active = targets[0];
      for (const target of targets) if (target.getBoundingClientRect().top <= line) active = target;
      for (const link of links) {
        if (decodeURIComponent(link.hash.slice(1)) === active.id) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      }
    };
    let pending = false;
    addEventListener("scroll", () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; update(); });
    }, { passive: true });
    update();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready); else ready();
})();
`;
