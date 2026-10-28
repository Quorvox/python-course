/* общие мелочи: DOM, форматирование текста, иконки, хранилище прогресса */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

// ‹код›  **жирный**  ⟦Клавиша⟧  [ссылка](https://…)  [внутри](#/vars)
// код разбирается первым, чтобы ** внутри него не ломали разметку
const fmt = s => esc(s).replace(/‹(.+?)›|\*\*(.+?)\*\*|⟦(.+?)⟧|\[([^\]]+)\]\(((?:https?:\/\/|#\/)[^)\s]*)\)/g,
  (m, c, b, k, lt, lu) => {
    if (c !== undefined) return `<code>${c}</code>`;
    if (b !== undefined) return `<strong>${b.replace(/‹(.+?)›/g, '<code>$1</code>')}</strong>`;
    if (k !== undefined) return `<kbd>${k}</kbd>`;
    return `<a href="${lu}"${lu[0] === '#' ? '' : ' target="_blank" rel="noopener noreferrer"'}>${lt}</a>`;
  });

/* иконки в стиле Lucide */
const ICON = {
  play:'<polygon points="6 4 20 12 6 20 6 4"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5"/><path d="M12 17.5h.01"/>',
  bulb:'<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.3 1 2.3h6c0-1 .3-1.7 1-2.3A7 7 0 0 0 12 2z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
  chev:'<path d="m6 9 6 6 6-6"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  term:'<path d="m5 8 5 4-5 4"/><path d="M13 17h6"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  quiz:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-6"/>',
  warn:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  reset:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  flame:'<path d="M12 22c4 0 7-2.8 7-7 0-3-1.8-5-3.2-6.6C14.6 7 14 5.5 14 3c-3 1.5-6 5.5-6 9 0 .8.1 1.5.4 2.2-.9-.3-1.7-1-2.1-2C5.5 13 5 14 5 15c0 4.2 3 7 7 7z"/>',
  book:'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V4.5"/>',
  dict:'<path d="M5 3h11a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3z"/><path d="M9 8h6M9 12h6"/>',
  rocket:'<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9s-2.2-.8-2.9-.1z"/><path d="m12 15-3-3a22 22 0 0 1 2-4 12 12 0 0 1 11-5c0 3-1.8 8-5 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
  dumbbell:'<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
  code:'<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  map:'<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
  keyboard:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M9 15h6"/>',
  sheet:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  flag:'<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
};
const ic = (n, extra = '') => `<svg class="i ${extra}" viewBox="0 0 24 24" aria-hidden="true">${ICON[n] || ''}</svg>`;

/* ---------- хранилище: только этот браузер ---------- */
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
};
const readJSON = (k, d) => { try { return JSON.parse(ls.get(k, '')) || d; } catch (e) { return d; } };

const Store = {
  done: readJSON('pycourse', {}),
  days: readJSON('pycourse_days', []),
  proj: readJSON('pycourse_proj', {}),
  _day(d = new Date()) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
  markTask(id) {
    this.done[id] = 1; ls.set('pycourse', JSON.stringify(this.done));
    const t = this._day();
    if (!this.days.includes(t)) { this.days.push(t); ls.set('pycourse_days', JSON.stringify(this.days.slice(-400))); }
  },
  // серия: подряд идущие дни с хотя бы одним решённым заданием (сегодня может ещё не быть)
  streak() {
    const set = new Set(this.days); let d = new Date(), n = 0;
    if (!set.has(this._day(d))) d.setDate(d.getDate() - 1);
    while (set.has(this._day(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  },
  setStage(pid, i, on) {
    const p = this.proj[pid] || (this.proj[pid] = {});
    if (on) p[i] = 1; else delete p[i];
    ls.set('pycourse_proj', JSON.stringify(this.proj));
  },
  stagesDone(pid) { return Object.keys(this.proj[pid] || {}).length; },
};
