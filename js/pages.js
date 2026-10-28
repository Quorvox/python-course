/* экраны: главная, урок, тест уровня, практика, проекты, словарь, статичные страницы */
const LEVELS = COURSE.levels;
const ORDER = ['trainee', 'junior'];
const lessonsOf = lv => LEVELS[lv].lessons;
const ALL = ORDER.flatMap(lessonsOf);
const tasksOf = l => l.blocks.filter(b => b.k === 't');
const doneIn = l => tasksOf(l).filter(t => Store.done[t.id]).length;
const isFin = l => doneIn(l) === tasksOf(l).length;
const cnt = lv => lessonsOf(lv).reduce((n, l) => n + tasksOf(l).length, 0);
const cntDone = lv => lessonsOf(lv).reduce((n, l) => n + doneIn(l), 0);
const practiceDone = () => COURSE.practice.filter(t => Store.done[t.id]).length;
const ST = { level: ORDER.includes(ls.get('pycourse_level')) ? ls.get('pycourse_level') : 'trainee', finishBox: null };
const nextLesson = lv => lessonsOf(lv).find(l => !isFin(l)) || lessonsOf(lv)[0];
const bar = (done, total, cls = '') => `<div class="bar2 ${cls}"><i style="width:${total ? done / total * 100 : 0}%"></i></div>`;
const plural = (n, a, b, c) => { const m = n % 100, k = n % 10; return m > 10 && m < 20 ? c : k === 1 ? a : k > 1 && k < 5 ? b : c; };

const Pages = {};

/* ---------- главная ---------- */
Pages.home = () => {
  document.title = 'Python с нуля: курс с практикой прямо в браузере';
  const root = el('div', 'wide');
  const totalAll = cnt('trainee') + cnt('junior') + COURSE.practice.length;
  const hero = el('div', 'hero');
  const left = el('div');
  left.append(el('h1', null, 'Python с нуля до джуна'));
  left.append(el('p', 'sub', 'Читаешь короткую теорию, запускаешь код прямо на странице и сразу проверяешь себя. Что-то непонятно — жми «Не понял» и получаешь объяснение проще и пример на других данных.'));
  const started = Store.days.length > 0;
  const nx = nextLesson(ST.level);
  left.append(el('div', 'ctas', `<a class="cta" href="#/${started ? nx.id : 'start'}">${started ? 'Продолжить: ' + esc(nx.title) : 'Начать'} ${ic('arrow')}</a><a class="cta alt" href="#/test">${ic('target')} Тест уровня</a>`));
  left.append(el('div', 'hero-stats', `<span><b>${ALL.length}</b>${plural(ALL.length, 'урок', 'урока', 'уроков')}</span><span><b>${totalAll}</b>заданий</span><span><b>${COURSE.glossary.length}</b>терминов</span><span><b>${COURSE.projects.length}</b>проектов</span>`));
  hero.append(left);
  hero.append(cell({ code: 'name = input("Как тебя зовут? ")\nprint(f"Привет, {name}! Это настоящий Python.")\nfor i in range(1, 4):\n    print("Шаг", i, "из 3")\n', stdin: 'Коля' }));
  root.append(hero);

  root.append(el('h2', 'sec-h', 'Как учимся'), el('p', 'sec-s', 'Три шага в каждом уроке. Никаких установок: Python работает в браузере.'));
  root.append(el('div', 'steps3', [
    ['book', 'Читаешь коротко', 'Теория по разделам простыми словами. Термины подсвечены: наведи, и увидишь, что это.'],
    ['play', 'Запускаешь сам', 'Каждый пример живой: меняй код, ломай, смотри, что выйдет. Есть подсветка и номера строк.'],
    ['check', 'Проверяешь себя', 'Автопроверка заданий, подсказки и разбор «по шагам», если задание непонятно.'],
  ].map(([i, h, p]) => `<div class="step3"><div class="ico">${ic(i)}</div><h3>${h}</h3><p>${p}</p></div>`).join('')));

  root.append(el('h2', 'sec-h', 'Выбери уровень'), el('p', 'sec-s', 'Не знаешь, с какого начать? Пройди тест уровня, это 8 вопросов.'));
  const paths = el('div', 'paths');
  ORDER.forEach(k => {
    const lv = LEVELS[k], dn = cntDone(k), tot = cnt(k);
    const a = el('a', 'path ' + k, `<h3>${lv.name}</h3><p>${esc(lv.desc)}</p><span class="stat">${lv.lessons.length} уроков · ${dn}/${tot} заданий</span>${bar(dn, tot)}`);
    a.href = '#/' + nextLesson(k).id;
    paths.append(a);
  });
  root.append(paths);

  root.append(el('h2', 'sec-h', 'Всё для учёбы в одном месте'));
  root.append(el('p', 'sec-s', 'Кроме уроков тут есть то, что обычно приходится искать по всему интернету.'));
  const tiles = [
    ['dumbbell', 'Практика', `${COURSE.practice.length} задач по темам: от разминки до собеседований`, '#/practice'],
    ['rocket', 'Проекты', `${COURSE.projects.length} проектов с планом, подсказками и чек-листом`, '#/projects'],
    ['dict', 'Словарь', `${COURSE.glossary.length} терминов простыми словами`, '#/glossary'],
    ['book', 'Книги и сайты', 'Что читать, где тренироваться и куда расти дальше', '#/books'],
    ['keyboard', 'VS Code и терминал', 'Установка, горячие клавиши, команды, отладка', '#/vscode'],
    ['sheet', 'Шпаргалка', 'Синтаксис и методы на одной странице', '#/cheats'],
  ];
  root.append(el('div', 'tiles', tiles.map(([i, h, p, href]) => `<a class="tile" href="${href}"><div class="ico">${ic(i)}</div><b>${h}</b><span>${p}</span></a>`).join('')));

  root.append(el('h2', 'sec-h', `Уроки уровня «${LEVELS[ST.level].name}»`));
  const ol = el('ol', 'toc');
  lessonsOf(ST.level).forEach((l, i) => {
    const li = el('li'); const a = el('a', null, `<span class="n">${i + 1}</span><span><b>${esc(l.title)} ${isFin(l) ? '<span class="ck">✓</span>' : ''}</b><span class="d">${esc(l.blurb)}</span></span>`);
    a.href = '#/' + l.id; li.append(a); ol.append(li);
  });
  root.append(ol);
  root.append(el('div', 'foot', 'Курс от <a href="https://quorvox.github.io/" target="_blank" rel="noopener noreferrer">Quorvox_team</a>. Прогресс хранится только в твоём браузере. Исходники: <a href="https://github.com/Quorvox/python-course" target="_blank" rel="noopener noreferrer">GitHub</a>.'));
  return { node: root, nav: '', side: false };
};

/* ---------- урок ---------- */
Pages.lesson = id => {
  const l = ALL.find(x => x.id === id);
  if (!l) return null;
  if (l.level !== ST.level) { ST.level = l.level; ls.set('pycourse_level', ST.level); }
  const list = lessonsOf(ST.level), i = list.indexOf(l);
  document.title = `${l.title} · Python с нуля`;
  const wrap = el('div', 'with-toc');
  const col = el('article', 'page');
  col.append(el('div', 'crumbs', `<span class="chip ${l.level}">${LEVELS[l.level].name}</span><span>Урок ${i + 1} из ${list.length}</span>`));
  col.append(el('h1', null, esc(l.title)), el('p', 'lead', esc(l.lead)));
  const heads = renderBlocks(col, l.blocks);
  const rc = COURSE.recaps[l.id];
  if (rc) col.append(el('div', 'recap', `<h3>Главное за минуту</h3><ul>${rc.map(x => `<li>${fmt(x)}</li>`).join('')}</ul>`));
  ST.finishBox = el('div'); col.append(ST.finishBox);
  const pager = el('div', 'pager');
  if (i > 0) { const a = el('a', 'prev', `<small>Назад</small>${esc(list[i - 1].title)}`); a.href = '#/' + list[i - 1].id; pager.append(a); }
  if (i < list.length - 1) { const a = el('a', 'next', `<small>Дальше</small>${esc(list[i + 1].title)}`); a.href = '#/' + list[i + 1].id; pager.append(a); }
  col.append(pager);
  wrap.append(col, tocRight(heads));
  Pages.refreshFinish();
  return { node: wrap, nav: '', side: true };
};

function tocRight(heads) {
  const aside = el('aside', 'toc-r');
  aside.innerHTML = '<b>На этой странице</b>' + heads.map(h => `<a href="#" data-h="${h.id}">${esc(h.text)}</a>`).join('');
  $$('a', aside).forEach(a => a.onclick = e => { e.preventDefault(); document.getElementById(a.dataset.h).scrollIntoView({ behavior: 'smooth' }); });
  return aside;
}

Pages.refreshFinish = () => {
  const box = ST.finishBox; if (!box || !box.isConnected) return;
  const l = ALL.find(x => x.id === Route.parts()[0]); if (!l) return;
  if (!tasksOf(l).length) { box.className = ''; box.innerHTML = ''; return; }
  const list = lessonsOf(l.level);
  if (list.every(isFin)) {
    const other = l.level === 'trainee' ? 'junior' : null;
    box.className = 'finish';
    box.innerHTML = `<h3>Уровень «${LEVELS[l.level].name}» пройден</h3><p>Все задания выполнены. ${other ? `Дальше — уровень «${LEVELS[other].name}»: <a href="#/${lessonsOf(other)[0].id}">начать</a>.` : 'Теперь свой проект: <a href="#/projects">выбери из списка</a> и выложи на GitHub — это твоё портфолио.'}</p>`;
  } else if (isFin(l)) {
    box.className = 'finish';
    box.innerHTML = '<h3>Урок пройден</h3><p>Все задания этого урока выполнены. Хочешь закрепить? Загляни в <a href="#/practice">практику</a>.</p>';
  } else { box.className = ''; box.innerHTML = ''; }
};

/* ---------- тест уровня ---------- */
Pages.test = () => {
  document.title = 'Тест уровня · Python с нуля';
  const Qs = COURSE.placement;
  const col = el('div', 'col page placement');
  col.append(el('h1', null, 'Тест уровня'), el('p', 'lead', `${Qs.length} вопросов без ограничения по времени. Не знаешь ответ — угадывай, тест просто подскажет, с чего начать.`));
  let answered = 0, right = 0; const missed = [];
  const res = el('div'); res.hidden = true;
  Qs.forEach(q => {
    const root = el('div', 'quiz');
    root.append(el('div', 'qh', ic('quiz') + 'Вопрос'), el('p', 'q', fmt(q.q)));
    const box = el('div', 'opts'); const why = el('p', 'why'); why.hidden = true;
    const btns = q.opts.map((o, i) => {
      const x = el('button', 'opt', fmt(o));
      x.onclick = () => {
        btns.forEach((y, j) => { y.disabled = true; if (j === q.ans) y.classList.add('right'); });
        if (i === q.ans) right++; else { x.classList.add('wrong'); missed.push(q.lesson); }
        why.hidden = false; why.innerHTML = (i === q.ans ? '<b>Верно.</b> ' : '<b>Нет.</b> ') + fmt(q.why);
        if (++answered === Qs.length) finish();
      };
      return x;
    });
    box.append(...btns); root.append(box, why); col.append(root);
  });
  col.append(res);
  function finish() {
    const lv = right >= Qs.length - 2 ? 'junior' : 'trainee';
    const gaps = [...new Set(missed)].map(id => ALL.find(x => x.id === id)).filter(Boolean);
    res.hidden = false; res.className = 'res';
    res.innerHTML = `<h3>Верно: ${right} из ${Qs.length}. Твой уровень — «${LEVELS[lv].name}»</h3><p>${lv === 'junior'
      ? 'База у тебя есть. Начинай с джуна, а если где-то поплывёшь — вернись к нужному уроку стажёра.'
      : 'Лучше пройти курс стажёра: он быстрый, а пробелы закроются.'}</p>` +
      (gaps.length ? `<p>Повтори: ${gaps.map(g => `<a href="#/${g.id}">${esc(g.title)}</a>`).join(', ')}.</p>` : '') +
      `<p><a class="cta" href="#/${nextLesson(lv).id}">Начать уровень «${LEVELS[lv].name}»</a></p>`;
    res.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return { node: col, nav: '', side: true };
};

/* ---------- статичные страницы из COURSE.pages ---------- */
Pages.static = id => {
  const pg = COURSE.pages[id];
  if (!pg) return null;
  document.title = `${pg.title} · Python с нуля`;
  const wrap = el('div', 'with-toc');
  const col = el('article', 'page');
  col.append(el('h1', null, esc(pg.title)), el('p', 'lead', fmt(pg.lead)));
  const heads = renderBlocks(col, pg.blocks);
  wrap.append(col, tocRight(heads));
  return { node: wrap, nav: id === 'start' ? '' : id, side: false };
};

/* ---------- практика ---------- */
Pages.practice = topic => {
  const tp = COURSE.topics.find(t => t.id === topic);
  if (!topic || !tp) {
    document.title = 'Практика · Python с нуля';
    const col = el('div', 'page wide');
    const total = COURSE.practice.length, dn = practiceDone();
    col.append(el('h1', null, 'Практика'), el('p', 'lead', 'Задачи по темам, от разминки до собеседований. У каждой задачи есть пример «вызов → результат» и разбор по шагам. Начни с лёгких и иди дальше.'));
    col.append(el('div', 'pmeter', `<span>Решено ${dn} из ${total}</span>${bar(dn, total)}`));
    col.append(cardsBlock(COURSE.topics.map(t => {
      const items = COURSE.practice.filter(x => x.topic === t.id), d = items.filter(x => Store.done[x.id]).length;
      return { title: t.title, text: t.blurb, href: '#/practice/' + t.id, tags: [`${d}/${items.length} решено`, ...[...new Set(items.map(x => DIFF[x.d]))]] };
    })));
    col.append(el('p', null, 'Не получается? Это нормально. Сначала нажми «Не понял задание», потом «Подсказка», и только потом смотри решение: так мозг запоминает лучше.'));
    return { node: col, nav: 'practice', side: false };
  }
  document.title = `${tp.title} · Практика`;
  const col = el('div', 'page wide');
  const items = COURSE.practice.filter(x => x.topic === tp.id).sort((a, b) => a.d - b.d);
  let flt = 0;
  col.append(el('div', 'crumbs', '<a href="#/practice">Практика</a><span>/</span><span>' + esc(tp.title) + '</span>'));
  col.append(el('h1', null, esc(tp.title)), el('p', 'lead', esc(tp.blurb)));
  const meter = el('div', 'pmeter'); col.append(meter);
  const upd = () => { const d = items.filter(x => Store.done[x.id]).length; meter.innerHTML = `<span>Решено ${d} из ${items.length}</span>${bar(d, items.length)}`; };
  App.onProgress.push(upd); upd();
  const fl = el('div', 'filters'); col.append(fl);
  const list = el('div', 'col');
  const draw = () => {
    fl.innerHTML = ['Все', 'Лёгкие', 'Средние', 'Сложные'].map((n, i) => `<button class="fchip" data-f="${i}" aria-pressed="${i === flt}">${n}</button>`).join('');
    $$('button', fl).forEach(b => b.onclick = () => { flt = +b.dataset.f; draw(); });
    list.innerHTML = '';
    items.filter(x => !flt || x.d === flt).forEach((t, i) => list.append(taskCard(t, i + 1)));
    Glossary.decorate(list);
  };
  draw(); col.append(list);
  return { node: col, nav: 'practice', side: false, keepListeners: true };
};

/* ---------- проекты ---------- */
const PJ_LEVEL = {1:'начальный', 2:'средний', 3:'продвинутый'};
Pages.projects = () => {
  const pg = COURSE.pages.projects;
  document.title = 'Проекты · Python с нуля';
  const col = el('div', 'page wide');
  col.append(el('h1', null, 'Проекты'), el('p', 'lead', fmt(pg.lead)));
  let flt = 0;
  const fl = el('div', 'filters'); col.append(fl);
  const grid = el('div'); col.append(grid);
  const draw = () => {
    fl.innerHTML = ['Все', 'Начальные', 'Средние', 'Продвинутые'].map((n, i) => `<button class="fchip" data-f="${i}" aria-pressed="${i === flt}">${n}</button>`).join('');
    $$('button', fl).forEach(b => b.onclick = () => { flt = +b.dataset.f; draw(); });
    grid.innerHTML = '';
    grid.append(cardsBlock(COURSE.projects.filter(p => !flt || p.level === flt).map(p => ({
      title: p.title, text: p.blurb, href: '#/proj/' + p.id,
      tags: [PJ_LEVEL[p.level], p.time, `этапов ${Store.stagesDone(p.id)}/${p.stages.length}`],
    }))));
  };
  draw();
  renderBlocks(col, pg.blocks);
  return { node: col, nav: 'projects', side: false };
};

Pages.project = id => {
  const p = COURSE.projects.find(x => x.id === id);
  if (!p) return null;
  document.title = `${p.title} · Проекты`;
  const col = el('article', 'page col');
  col.append(el('div', 'crumbs', '<a href="#/projects">Проекты</a><span>/</span><span>' + esc(p.title) + '</span>'));
  col.append(el('h1', null, esc(p.title)), el('p', 'lead', fmt(p.blurb)));
  col.append(el('div', 'pj-head', `<span class="badge d${p.level}">${PJ_LEVEL[p.level]}</span><span class="badge">${esc(p.time)}</span>` + p.tags.map(t => `<span class="badge">${esc(t)}</span>`).join('')));
  const needs = (p.needs || []).map(i => ALL.find(l => l.id === i)).filter(Boolean);
  if (needs.length) col.append(el('div', 'box', ic('bulb') + `<div><b>Что надо знать заранее:</b> ${needs.map(n => `<a href="#/${n.id}">${esc(n.title)}</a>`).join(', ')}.</div>`));
  col.append(el('h2', null, 'Что получится'));
  col.append(el('p', null, 'Это уже работающее ядро проекта: запусти, поиграй и пойми идею. Дальше ты соберёшь его сам по этапам и доведёшь до версии, которую не стыдно показать.'));
  col.append(cell({ code: p.demo, stdin: p.stdin || '' }));
  col.append(el('h2', null, 'Чему научишься'), el('ul', 'ls', p.learn.map(x => `<li>${fmt(x)}</li>`).join('')));
  col.append(el('h2', null, 'Этапы'));
  col.append(el('p', null, 'Отмечай галочкой, что сделано (прогресс сохраняется). Застрял на этапе? Открой «Нужна помощь?»: там подход и подсказка, но не готовое решение целиком.'));
  const stages = el('div');
  const meter = el('div', 'pmeter'); col.append(meter);
  const upd = () => { const d = Store.stagesDone(p.id); meter.innerHTML = `<span>Этапов готово: ${d} из ${p.stages.length}</span>${bar(d, p.stages.length)}`; };
  upd();
  p.stages.forEach((s, i) => {
    const st = el('div', 'stage' + (Store.proj[p.id] && Store.proj[p.id][i] ? ' done' : ''));
    const h = el('label', 'stage-h');
    const cb = el('input'); cb.type = 'checkbox'; cb.checked = !!(Store.proj[p.id] && Store.proj[p.id][i]);
    cb.onchange = () => { Store.setStage(p.id, i, cb.checked); st.classList.toggle('done', cb.checked); upd(); };
    h.append(cb, el('div', null, `<b>${i + 1}. ${esc(s.title)}</b><span>${fmt(s.text)}</span>`));
    st.append(h);
    if (s.help || s.code) {
      const d = el('details'); d.append(el('summary', null, ic('help') + 'Нужна помощь?' + ic('chev', 'chev')));
      const body = el('div', 'dbody');
      if (s.help) body.append(el('p', null, fmt(s.help)));
      if (s.code) body.append(kblock({ code: s.code, title: 'подсказка.py' }));
      d.append(body); st.append(d);
    }
    stages.append(st);
  });
  col.append(stages);
  if (p.ideas && p.ideas.length) col.append(el('h2', null, 'Как усложнить'), el('ul', 'ls', p.ideas.map(x => `<li>${fmt(x)}</li>`).join('')));
  col.append(el('h2', null, 'Как оформить для портфолио'));
  col.append(el('ul', 'ls', [
    'Репозиторий на GitHub с понятным названием и **README**: что делает программа, как запустить, пример работы (скриншот или текстовый вывод).',
    ...(p.readme || []),
    'Файл ‹.gitignore› и никаких паролей, токенов и личных файлов в коммитах.',
    'Несколько осмысленных коммитов вместо одного «всё сразу». Подробнее в разделе [VS Code и терминал](#/vscode).',
  ].map(x => `<li>${fmt(x)}</li>`).join('')));
  col.append(el('p', null, '<a href="#/projects">← Все проекты</a>'));
  return { node: col, nav: 'projects', side: false };
};

/* ---------- словарь ---------- */
const Glossary = {
  byId(id) { return COURSE.glossary.find(g => g.id === id); },
  compile() {
    COURSE.glossary.forEach(g => {
      if (g.rx && !g.re) { try { g.re = new RegExp('(?<![\\p{L}\\d_])(?:' + g.rx + ')', 'iu'); } catch (e) {} }
    });
  },
  // подчёркивает первое упоминание термина на странице: при наведении видно, что это
  decorate(root, max = 10) {
    const terms = COURSE.glossary.filter(g => g.re), seen = new Set();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(n) {
      const p = n.parentElement;
      if (!p || !n.nodeValue.trim() || p.closest('code,pre,a,button,kbd,textarea,summary,h1,h2,h3,abbr,.cell,.kblock,.term,.task-h,.badge,.crumbs')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    } });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    const proc = node => {
      if (seen.size >= max) return;
      let best = null;
      for (const g of terms) {
        if (seen.has(g.id)) continue;
        const m = g.re.exec(node.nodeValue);
        if (m && (!best || m.index < best.m.index)) best = { g, m };
      }
      if (!best) return;
      const { g, m } = best; seen.add(g.id);
      const after = node.splitText(m.index + m[0].length);
      const mid = node.splitText(m.index);
      const ab = el('abbr', 'gl', esc(mid.nodeValue)); ab.dataset.g = g.id; ab.tabIndex = 0;
      mid.replaceWith(ab);
      proc(after);
    };
    nodes.forEach(proc);
  },
};

Pages.glossary = termId => {
  document.title = 'Словарь · Python с нуля';
  const col = el('div', 'page col');
  col.append(el('h1', null, 'Словарь'), el('p', 'lead', `${COURSE.glossary.length} терминов простыми словами. Встретил незнакомое слово в уроке — ищи здесь.`));
  const sr = el('div', 'gl-search', '<input type="search" placeholder="Найти термин: например, цикл, список, функция" aria-label="Поиск по словарю">');
  col.append(sr);
  const letters = el('div', 'letters'); col.append(letters);
  const list = el('div'); col.append(list);
  const sorted = [...COURSE.glossary].sort((a, b) => a.term.localeCompare(b.term, 'ru'));
  const draw = q => {
    q = (q || '').trim().toLowerCase();
    const items = sorted.filter(g => !q || (g.term + ' ' + (g.en || '') + ' ' + g.def).toLowerCase().includes(q));
    list.innerHTML = '';
    if (!items.length) { list.append(el('p', 'nores', 'Ничего не нашлось. Попробуй другое слово или загляни в [Шпаргалку](#/cheats).'.replace(/\[(.+?)\]\((.+?)\)/, '<a href="$2">$1</a>'))); letters.innerHTML = ''; return; }
    let cur = '';
    const ls_ = [];
    items.forEach(g => {
      const L = g.term[0].toUpperCase();
      if (L !== cur) { cur = L; const h = el('div', 'gl-letter', esc(L)); h.id = 'L' + L; list.append(h); ls_.push(L); }
      const t = el('div', 'term'); t.id = 'term-' + g.id;
      const lessons = (g.lessons || []).map(i => ALL.find(l => l.id === i) || (COURSE.pages[i] && { id: i, title: COURSE.pages[i].title })).filter(Boolean);
      t.innerHTML = `<h3>${esc(g.term)}${g.en ? `<small>${esc(g.en)}</small>` : ''}</h3><p>${fmt(g.def)}</p>` +
        (g.ex ? `<pre>${Highlight.html(g.ex)}</pre>` : '') +
        (lessons.length ? `<div class="links">Где разбирается: ${lessons.map(l => `<a href="#/${l.id}">${esc(l.title)}</a>`).join(' ')}</div>` : '');
      list.append(t);
    });
    letters.innerHTML = ls_.map(L => `<a href="#" data-l="${L}">${esc(L)}</a>`).join('');
    $$('a', letters).forEach(a => a.onclick = e => { e.preventDefault(); document.getElementById('L' + a.dataset.l).scrollIntoView({ behavior: 'smooth' }); });
  };
  draw('');
  $('input', sr).addEventListener('input', e => draw(e.target.value));
  if (termId) setTimeout(() => { const t = document.getElementById('term-' + termId); if (t) { t.classList.add('hl'); t.scrollIntoView({ block: 'center' }); } }, 30);
  return { node: col, nav: 'glossary', side: false, noScroll: !!termId };
};
