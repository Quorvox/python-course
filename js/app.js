/* каркас: шапка, меню, маршруты, поиск, подсказки терминов */
const Route = {
  parts() { return (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean).map(decodeURIComponent); },
};
const NAV = [
  ['', 'Курс', 'list'], ['practice', 'Практика', 'dumbbell'], ['projects', 'Проекты', 'rocket'], ['glossary', 'Словарь', 'dict'],
  ['books', 'Книги', 'book'], ['vscode', 'VS Code', 'keyboard'], ['cheats', 'Шпаргалка', 'sheet'],
];
const hdr = $('#hdr'), side = $('#side'), app = $('#app'), shell = $('#shell');
let curNav = '';

function curTheme() { return document.documentElement.dataset.theme || 'light'; }
function setTheme(t) { document.documentElement.dataset.theme = t; ls.set('pycourse_theme', t); drawHeader(); }

function drawHeader() {
  const st = Store.streak();
  hdr.innerHTML = `
    <button class="hbtn only-small" id="menuBtn" aria-label="Меню" aria-expanded="false" aria-controls="side">${ic('menu')}</button>
    <a class="brand" href="#/"><span class="logo">${ic('term')}</span><span class="t">Python с нуля</span></a>
    <nav class="hnav" aria-label="Разделы">${NAV.map(([k, n]) => `<a href="#/${k}" ${k === curNav ? 'aria-current="page"' : ''}>${n}</a>`).join('')}</nav>
    <div class="hright">
      ${st ? `<span class="streak" title="Дней подряд с решённым заданием">${ic('flame')}<span>${st}</span><span class="lbl">${plural(st, 'день', 'дня', 'дней')}</span></span>` : ''}
      <button class="hbtn" id="searchBtn" aria-label="Поиск">${ic('search')}<span class="lbl">Поиск</span><kbd>Ctrl K</kbd></button>
      <button class="hbtn" id="themeBtn" aria-label="Сменить тему">${ic(curTheme() === 'dark' ? 'sun' : 'moon')}</button>
    </div>`;
  $('#menuBtn').onclick = () => { const o = side.classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', String(o)); };
  $('#themeBtn').onclick = () => setTheme(curTheme() === 'dark' ? 'light' : 'dark');
  $('#searchBtn').onclick = () => Search.open();
}

function closeMenu() { side.classList.remove('open'); const b = $('#menuBtn'); if (b) b.setAttribute('aria-expanded', 'false'); }
document.addEventListener('click', e => {
  if (side.classList.contains('open') && !side.contains(e.target) && !e.target.closest('#menuBtn')) closeMenu();
});

function drawSide(course) {
  const cur = Route.parts()[0];
  const mnav = `<nav class="mnav" aria-label="Разделы">${NAV.map(([k, n, i]) => `<a href="#/${k}" ${k === curNav ? 'aria-current="page"' : ''}>${ic(i)}${n}</a>`).join('')}</nav>`;
  if (!course) { side.innerHTML = mnav; return; }
  const total = cnt(ST.level), dn = cntDone(ST.level);
  side.innerHTML = mnav + `
    <div class="level" role="group" aria-label="Уровень">${ORDER.map(k => `<button data-lvl="${k}" aria-pressed="${k === ST.level}">${LEVELS[k].name}<small>${LEVELS[k].tag}</small></button>`).join('')}</div>
    <div class="meter"><div class="meter-bar"><i style="width:${total ? Math.round(dn / total * 100) : 0}%"></i></div><small>Заданий выполнено: ${dn} из ${total}</small></div>
    <ol class="lessons">${lessonsOf(ST.level).map((l, i) => `<li><a href="#/${l.id}" ${l.id === cur ? 'aria-current="page"' : ''}><span class="n">${i + 1}</span><span>${esc(l.title)}</span><span class="ck">${isFin(l) ? '✓' : ''}</span></a></li>`).join('')}</ol>
    <p class="side-foot">Python работает прямо в браузере (Pyodide). Прогресс хранится только у тебя в браузере.</p>`;
  $$('.level button', side).forEach(b => b.onclick = () => {
    ST.level = b.dataset.lvl; ls.set('pycourse_level', ST.level);
    location.hash = '#/' + nextLesson(ST.level).id;
  });
}

/* ---------- маршрутизатор ---------- */
const BASE_LISTENERS = [
  () => drawHeader(),
  () => { if (!shell.classList.contains('no-side')) drawSide(true); },
  () => Pages.refreshFinish(),
];
function route() {
  const [a, b] = Route.parts();
  App.onProgress.length = 0; App.onProgress.push(...BASE_LISTENERS);
  let res = null, kind = '';
  if (!a) { res = Pages.home(); kind = 'home'; }
  else if (a === 'test') { res = Pages.test(); kind = 'test'; }
  else if (a === 'practice') { res = Pages.practice(b); kind = 'practice'; }
  else if (a === 'projects') { res = Pages.projects(); kind = 'projects'; }
  else if (a === 'proj') { res = Pages.project(b); kind = 'project'; }
  else if (a === 'glossary') { res = Pages.glossary(b); kind = 'glossary'; }
  else if (COURSE.pages[a] && a !== 'projects') { res = Pages.static(a); kind = 'static'; }
  else { res = Pages.lesson(a); kind = 'lesson'; }
  if (!res) { res = Pages.home(); kind = 'home'; }
  curNav = res.nav;
  app.innerHTML = ''; app.append(res.node);
  shell.classList.toggle('no-side', !res.side);
  drawSide(res.side); drawHeader(); closeMenu();
  if (['lesson', 'project', 'test'].includes(kind) || a === 'start') Glossary.decorate(app, 8);
  if (kind === 'lesson' || kind === 'static') spy();
  if (!res.noScroll) window.scrollTo(0, 0);
}

// подсветка текущего раздела в оглавлении справа
let spyObs = null;
function spy() {
  if (spyObs) spyObs.disconnect();
  const links = $$('.toc-r a'); if (!links.length) return;
  const map = new Map(links.map(a => [a.dataset.h, a]));
  spyObs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); } });
  }, { rootMargin: '-70px 0px -70% 0px' });
  map.forEach((_, id) => { const h = document.getElementById(id); if (h) spyObs.observe(h); });
}

/* ---------- подсказки терминов ---------- */
const pop = el('div'); pop.id = 'pop'; document.body.append(pop);
let popFor = null;
function showPop(ab) {
  const g = Glossary.byId(ab.dataset.g); if (!g) return;
  popFor = ab;
  pop.innerHTML = `<b>${esc(g.term)}</b>${fmt(g.def)}<br><a href="#/glossary/${g.id}">Открыть в словаре</a>`;
  pop.style.display = 'block';
  const r = ab.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
  let x = Math.min(Math.max(8, r.left), innerWidth - pw - 8);
  let y = r.bottom + 8; if (y + ph > innerHeight - 8) y = r.top - ph - 8;
  pop.style.left = x + 'px'; pop.style.top = Math.max(8, y) + 'px';
}
const hidePop = () => { pop.style.display = 'none'; popFor = null; };
document.addEventListener('mouseover', e => { const ab = e.target.closest && e.target.closest('abbr.gl'); if (ab) showPop(ab); else if (!e.target.closest('#pop')) hidePop(); });
document.addEventListener('focusin', e => { const ab = e.target.closest && e.target.closest('abbr.gl'); if (ab) showPop(ab); });
document.addEventListener('click', e => { const ab = e.target.closest && e.target.closest('abbr.gl'); if (ab) { showPop(ab); } else if (!e.target.closest('#pop')) hidePop(); });
document.addEventListener('scroll', hidePop, { passive: true });

/* ---------- поиск Ctrl+K ---------- */
const Search = (() => {
  const box = el('div'); box.id = 'sk';
  box.innerHTML = '<div class="sk" role="dialog" aria-label="Поиск"><input type="search" placeholder="Искать по урокам, терминам, проектам, задачам…" aria-label="Поиск"><ul></ul></div>';
  document.body.append(box);
  const input = $('input', box), ul = $('ul', box);
  let index = null, sel = 0, shown = [];
  const build = () => {
    index = [];
    ALL.forEach(l => index.push({ t: l.title, s: l.blurb, k: l.level === 'trainee' ? 'Стажёр' : 'Джун', href: '#/' + l.id, h: [l.title, l.blurb, l.lead, ...l.blocks.filter(b => b.k === 's').map(b => b.x)].join(' ') }));
    COURSE.glossary.forEach(g => index.push({ t: g.term, s: g.def, k: 'Словарь', href: '#/glossary/' + g.id, h: g.term + ' ' + (g.en || '') + ' ' + g.def }));
    COURSE.projects.forEach(p => index.push({ t: p.title, s: p.blurb, k: 'Проект', href: '#/proj/' + p.id, h: p.title + ' ' + p.blurb + ' ' + p.tags.join(' ') }));
    COURSE.practice.forEach(t => index.push({ t: t.title, s: t.text, k: 'Практика', href: '#/practice/' + t.topic, h: t.title + ' ' + t.text }));
    COURSE.topics.forEach(t => index.push({ t: t.title, s: t.blurb, k: 'Практика', href: '#/practice/' + t.id, h: t.title + ' ' + t.blurb }));
    Object.entries(COURSE.pages).forEach(([id, p]) => { if (id !== 'projects') index.push({ t: p.title, s: p.lead, k: 'Раздел', href: '#/' + id, h: p.title + ' ' + p.lead + ' ' + p.blocks.filter(b => b.k === 's').map(b => b.x).join(' ') }); });
    NAV.slice(1, 4).forEach(([k, n]) => index.push({ t: n, s: 'Раздел курса', k: 'Раздел', href: '#/' + k, h: n }));
    index.forEach(i => { i.lo = i.h.toLowerCase().replace(/ё/g, 'е'); i.tl = i.t.toLowerCase().replace(/ё/g, 'е'); });
  };
  const draw = () => {
    const q = input.value.trim().toLowerCase().replace(/ё/g, 'е');
    if (!index) build();
    const toks = q.split(/\s+/).filter(Boolean);
    shown = !toks.length ? index.filter(i => i.k === 'Раздел').slice(0, 8) :
      index.filter(i => toks.every(t => i.lo.includes(t)))
        .map(i => ({ i, sc: (i.tl.startsWith(toks[0]) ? 0 : i.tl.includes(toks[0]) ? 1 : 2) }))
        .sort((a, b) => a.sc - b.sc).map(x => x.i).slice(0, 30);
    sel = 0;
    ul.innerHTML = shown.length ? shown.map((i, n) => `<li><a href="${i.href}" class="${n === 0 ? 'sel' : ''}"><b>${esc(i.t)}</b><span>${esc(i.s.slice(0, 70))}</span><small>${i.k}</small></a></li>`).join('') : '<li class="empty">Ничего не нашлось. Попробуй другое слово.</li>';
    $$('a', ul).forEach(a => a.addEventListener('click', close));
  };
  const open = () => { box.classList.add('open'); input.value = ''; draw(); input.focus(); };
  const close = () => box.classList.remove('open');
  const move = d => { const as = $$('a', ul); if (!as.length) return; as[sel]?.classList.remove('sel'); sel = (sel + d + as.length) % as.length; as[sel].classList.add('sel'); as[sel].scrollIntoView({ block: 'nearest' }); };
  input.addEventListener('input', draw);
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { const a = $$('a', ul)[sel]; if (a) { location.hash = a.getAttribute('href'); close(); } }
    else if (e.key === 'Escape') close();
  });
  box.addEventListener('mousedown', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); box.classList.contains('open') ? close() : open(); }
    else if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
    else if (e.key === 'Escape') close();
  });
  return { open, close };
})();

Glossary.compile();
window.addEventListener('hashchange', route);
route();
