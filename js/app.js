(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  // ‹код› и **жирный**; код разбирается первым, чтобы ** внутри него не ломали разметку
  const fmt = s => esc(s).replace(/‹(.+?)›|\*\*(.+?)\*\*/g, (m, c, b) =>
    c !== undefined ? `<code>${c}</code>` : `<strong>${b.replace(/‹(.+?)›/g, '<code>$1</code>')}</strong>`);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

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
  };
  const ic = (n, extra = '') => `<svg class="i ${extra}" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;

  /* хранилище: прогресс, уровень, тема — только в этом браузере */
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  let done = (() => { try { return JSON.parse(ls.get('pycourse', '{}')); } catch (e) { return {}; } })();
  const saveDone = () => ls.set('pycourse', JSON.stringify(done));

  const LEVELS = COURSE.levels;
  const ORDER = ['trainee', 'junior'];
  let level = ls.get('pycourse_level', 'trainee');
  if (!LEVELS[level]) level = 'trainee';
  const lessonsOf = lv => LEVELS[lv].lessons;
  const ALL = ORDER.flatMap(lessonsOf);
  const tasksOf = l => l.blocks.filter(b => b.k === 't');
  const doneIn = l => tasksOf(l).filter(t => done[t.id]).length;
  const isFin = l => doneIn(l) === tasksOf(l).length;
  const cnt = lv => lessonsOf(lv).reduce((n, l) => n + tasksOf(l).length, 0);
  const cntDone = lv => lessonsOf(lv).reduce((n, l) => n + doneIn(l), 0);
  const nextLesson = lv => lessonsOf(lv).find(l => !isFin(l)) || lessonsOf(lv)[0];

  /* тема */
  function setTheme(t) { document.documentElement.dataset.theme = t; ls.set('pycourse_theme', t); }
  const curTheme = () => document.documentElement.dataset.theme || 'light';

  /* ---------- ячейка с кодом ---------- */
  function errLine(msg) {
    const lines = msg.trim().split('\n');
    const last = lines[lines.length - 1];
    let ln = null;
    for (const l of lines) { const m = l.match(/File "<exec>", line (\d+)/); if (m) ln = m[1]; }
    return (ln ? `строка ${ln}: ` : '') + last;
  }

  function cell(b, t) {
    const code0 = t ? t.starter : b.code;
    const root = el('div', 'cell' + (t ? ' task' : ''));
    const ed = el('div', 'ed');
    const pre = el('pre'); const codeEl = el('code'); pre.append(codeEl); pre.setAttribute('aria-hidden', 'true');
    const ta = el('textarea');
    ta.value = code0; ta.spellcheck = false; ta.wrap = 'off';
    ta.setAttribute('aria-label', 'Код Python, можно править');
    ta.setAttribute('autocapitalize', 'off'); ta.setAttribute('autocomplete', 'off'); ta.setAttribute('autocorrect', 'off');
    const paint = () => { codeEl.innerHTML = Highlight.html(ta.value) + '\n'; ta.rows = Math.max(2, ta.value.split('\n').length); };
    paint();
    ta.addEventListener('scroll', () => { pre.scrollLeft = ta.scrollLeft; });
    ed.append(pre, ta);

    const stdinBox = el('div', 'stdin', 'Ответы для <code>input()</code>, по одному в строке:');
    const stdinTa = el('textarea'); stdinTa.rows = 2; stdinTa.value = b.stdin || ''; stdinTa.spellcheck = false;
    stdinBox.append(stdinTa);
    const showStdin = () => { stdinBox.hidden = !/\binput\s*\(/.test(ta.value); };
    showStdin();

    const bar = el('div', 'bar');
    const hasTest = !!(t && t.test);
    const btnRun = el('button', 'btn' + (hasTest ? '' : ' primary'), ic('play') + 'Запустить');
    const btnCheck = hasTest ? el('button', 'btn primary', ic('check') + 'Проверить') : null;
    bar.append(...[btnCheck, btnRun].filter(Boolean));
    let btnHint, btnSol;
    if (t && t.hint) { btnHint = el('button', 'btn ghost', ic('bulb') + 'Подсказка'); bar.append(btnHint); }
    if (hasTest && t.solution) { btnSol = el('button', 'btn ghost', 'Решение'); bar.append(btnSol); }
    bar.append(el('span', 'sp'));
    const btnReset = el('button', 'btn ghost', ic('reset') + 'Сбросить'); bar.append(btnReset);

    const out = el('pre', 'out'); out.hidden = true;
    const verdict = el('div', 'verdict'); verdict.hidden = true;
    const extra = el('div');
    root.append(ed, stdinBox, bar, out, verdict, extra);

    const setVerdict = (cls, text) => { verdict.hidden = false; verdict.className = 'verdict ' + cls; verdict.textContent = text; };
    const mark = () => {
      if (!t || done[t.id]) return;
      done[t.id] = 1; saveDone(); root.classList.add('done');
      const bd = document.getElementById('badge-' + t.id);
      if (bd) { bd.textContent = 'готово'; bd.classList.add('ok'); }
      renderSide();
      refreshFinish();
    };
    if (t && done[t.id]) root.classList.add('done');

    let busy = false;
    async function go(check) {
      if (busy) return;
      busy = true; [btnRun, btnCheck].forEach(x => x && (x.disabled = true));
      out.hidden = false; out.innerHTML = '<span class="dim">' + (PyEngine.loaded ? 'Выполняю…' : 'Загружаю Python — один раз, ~10 МБ…') + '</span>';
      verdict.hidden = true;
      const r = await PyEngine.run(ta.value, check && hasTest ? t.test : null, stdinTa.value, () => { out.innerHTML = '<span class="dim">Выполняю…</span>'; });
      busy = false; [btnRun, btnCheck].forEach(x => x && (x.disabled = false));
      if (r.fail) { out.innerHTML = '<span class="err">Не получилось загрузить Python. Нужен интернет (движок грузится с cdn.jsdelivr.net). Обнови страницу и попробуй ещё раз.</span>'; return; }
      if (r.timeout) { out.innerHTML = '<span class="err">Код работал дольше 8 секунд, я его остановил. Скорее всего, бесконечный цикл: проверь условие в while.</span>'; return; }
      let html = esc(r.out || '');
      if (!r.ok) html += (html ? '\n' : '') + '<span class="err">' + esc(errLine(r.error)) + '</span>';
      else if (!r.out) html = '<span class="dim">(программа ничего не вывела)</span>';
      out.innerHTML = html;
      if (!r.ok) return;
      if (check || (t && t.free)) {
        if (!hasTest) { mark(); setVerdict('ok', 'Выполнено'); }
        else if (r.passed) { mark(); setVerdict('ok', 'Верно! Задание выполнено.'); }
        else {
          const tl = (r.testError || '').trim().split('\n').pop().replace(/^AssertionError:\s*/, '');
          setVerdict('bad', 'Пока не сходится: ' + (tl || 'проверка не прошла'));
        }
      }
    }
    btnRun.onclick = () => go(!!(t && t.free));
    if (btnCheck) btnCheck.onclick = () => go(true);
    if (btnHint) btnHint.onclick = () => {
      let h = $('.hint', extra);
      if (!h) { h = el('p', 'hint', 'Подсказка: ' + fmt(t.hint)); extra.prepend(h); } else h.remove();
    };
    if (btnSol) {
      let armed = false, timer;
      btnSol.onclick = () => {
        const s = $('.sol', extra);
        if (s) { $('.sol-h', extra).remove(); s.remove(); btnSol.textContent = 'Решение'; return; }
        if (!armed) { armed = true; btnSol.textContent = 'Точно показать?'; timer = setTimeout(() => { armed = false; btnSol.textContent = 'Решение'; }, 4000); return; }
        clearTimeout(timer); armed = false; btnSol.textContent = 'Скрыть решение';
        extra.append(el('div', 'sol-h', 'Один из вариантов решения'), Object.assign(el('pre', 'sol'), { textContent: t.solution.trim() }));
      };
    }
    btnReset.onclick = () => { ta.value = code0; stdinTa.value = b.stdin || ''; paint(); showStdin(); out.hidden = true; verdict.hidden = true; };

    ta.addEventListener('input', () => { paint(); showStdin(); });
    ta.addEventListener('focus', () => PyEngine.warm(), { once: true });
    let noTrap = false;
    ta.addEventListener('keydown', e => {
      if (e.key === 'Escape') { noTrap = true; return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); go(hasTest); return; }
      if (e.key === 'Tab' && !e.shiftKey && !noTrap) { e.preventDefault(); ta.setRangeText('    ', ta.selectionStart, ta.selectionEnd, 'end'); paint(); return; }
      noTrap = false;
      if (e.key === 'Enter' && ta.selectionStart === ta.selectionEnd) {
        const pos = ta.selectionStart;
        const before = ta.value.slice(0, pos);
        const line = before.slice(before.lastIndexOf('\n') + 1);
        let indent = line.match(/^ */)[0];
        if (/:\s*$/.test(line)) indent += '    ';
        if (indent) { e.preventDefault(); ta.setRangeText('\n' + indent, pos, pos, 'end'); paint(); }
      }
    });
    return root;
  }

  /* ---------- блоки ---------- */
  function quiz(b) {
    const root = el('div', 'quiz');
    root.append(el('div', 'qh', ic('quiz') + 'Проверь себя'), el('p', 'q', fmt(b.q)));
    const box = el('div', 'opts');
    const why = el('p', 'why'); why.hidden = true;
    const btns = b.opts.map((o, i) => {
      const x = el('button', 'opt' + (/^[\wА-я ,.!?-]+$/.test(o) && o.length > 12 ? ' text' : ''), fmt(o));
      x.onclick = () => {
        btns.forEach((y, j) => { y.disabled = true; if (j === b.ans) y.classList.add('right'); });
        if (i !== b.ans) x.classList.add('wrong');
        why.hidden = false; why.innerHTML = (i === b.ans ? '<b>Верно.</b> ' : '<b>Не совсем.</b> ') + fmt(b.why || '');
      };
      return x;
    });
    box.append(...btns); root.append(box, why);
    return root;
  }

  function helpBox(b) {
    const d = el('details', 'help');
    d.append(el('summary', null, ic('help') + 'Не понял? Объясни проще' + ic('chev', 'chev')));
    const body = el('div', 'dbody');
    body.append(el('h4', null, 'Как для пятилетнего'));
    (Array.isArray(b.say) ? b.say : [b.say]).forEach(s => body.append(el('p', null, fmt(s))));
    body.append(el('h4', null, b.title || 'Тот же приём, но с другими данными'));
    body.append(cell({ code: b.code, stdin: b.stdin }));
    d.append(body);
    return d;
  }

  function howBox(b) {
    const d = el('details', 'how');
    d.append(el('summary', null, ic('gear') + esc(b.title || 'Как это работает внутри') + ic('chev', 'chev')));
    const body = el('div', 'dbody');
    const ol = el('ol', 'steps');
    b.steps.forEach(s => ol.append(el('li', null, fmt(s))));
    body.append(ol);
    if (b.code) body.append(cell({ code: b.code }));
    d.append(body);
    return d;
  }

  function renderBlocks(col, l) {
    let n = 0;
    for (const b of l.blocks) {
      switch (b.k) {
        case 'p': col.append(el('p', null, fmt(b.x))); break;
        case 's': col.append(el('h2', null, esc(b.x))); break;
        case 'n': col.append(el('div', 'box', ic('bulb') + '<div>' + fmt(b.x) + '</div>')); break;
        case 'w': col.append(el('div', 'box warn', ic('warn') + '<div>' + fmt(b.x) + '</div>')); break;
        case 'l': col.append(el('ul', 'ls', b.items.map(i => '<li>' + fmt(i) + '</li>').join(''))); break;
        case 'tb': col.append(el('div', 'tbl', '<table><thead><tr>' + b.head.map(h => '<th>' + fmt(h) + '</th>').join('') + '</tr></thead><tbody>' +
          b.rows.map(r => '<tr>' + r.map(c => '<td>' + fmt(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>')); break;
        case 'c': col.append(cell(b)); break;
        case 'e': col.append(helpBox(b)); break;
        case 'how': col.append(howBox(b)); break;
        case 'q': col.append(quiz(b)); break;
        case 't': {
          n++;
          const star = b.star ? '<span class="badge star">★ посложнее</span>' : '';
          col.append(el('div', 'task-h', `<span>Задание ${n}</span>${star}<span class="badge ${done[b.id] ? 'ok' : ''}" id="badge-${b.id}">${done[b.id] ? 'готово' : 'не выполнено'}</span>`),
            el('p', null, fmt(b.text)), cell(b, b));
          break;
        }
      }
    }
  }

  /* ---------- экраны ---------- */
  const app = $('#app');
  const side = $('#side');
  let finishBox = null;
  const curId = () => (location.hash.match(/^#\/([^/]+)$/) || [])[1];

  function renderSide() {
    const cur = curId();
    const lv = LEVELS[level];
    const total = cnt(level), dn = cntDone(level);
    const pct = total ? Math.round(dn / total * 100) : 0;
    side.innerHTML = `<a class="brand" href="#/"><span class="logo">${ic('term')}</span>Python с нуля</a>
      <div class="level" role="group" aria-label="Уровень">${ORDER.map(k => `<button data-lvl="${k}" aria-pressed="${k === level}">${LEVELS[k].name}<small>${LEVELS[k].tag}</small></button>`).join('')}</div>
      <div class="meter"><div class="meter-bar"><i style="width:${pct}%"></i></div><small>Заданий выполнено: ${dn} из ${total}</small></div>
      <ol class="lessons">${lv.lessons.map((l, i) => `<li><a href="#/${l.id}" ${l.id === cur ? 'aria-current="page"' : ''}><span class="n">${i + 1}</span><span>${esc(l.title)}</span><span class="ck">${isFin(l) ? '✓' : ''}</span></a></li>`).join('')}</ol>
      <div class="side-tools">
        <button class="tool" id="themeBtn" aria-label="Сменить тему">${ic(curTheme() === 'dark' ? 'sun' : 'moon')}${curTheme() === 'dark' ? 'Светлая' : 'Тёмная'}</button>
        <a class="tool" href="#/test">${ic('target')}Тест уровня</a>
      </div>
      <p class="side-foot">Курс от Quorvox_team.<br>Python работает прямо в браузере (Pyodide). Прогресс хранится только у тебя в браузере.</p>`;
    side.querySelectorAll('.level button').forEach(b => b.onclick = () => {
      level = b.dataset.lvl; ls.set('pycourse_level', level);
      location.hash = '#/' + nextLesson(level).id;
    });
    $('#themeBtn').onclick = () => { setTheme(curTheme() === 'dark' ? 'light' : 'dark'); renderSide(); };
  }

  function home() {
    document.title = 'Python с нуля';
    app.innerHTML = '';
    const col = el('div', 'col hero');
    col.append(el('h1', null, 'Python с нуля'));
    const totalAll = cnt('trainee') + cnt('junior');
    col.append(el('p', 'sub', `${ALL.length} уроков и ${totalAll} заданий с автопроверкой. Код запускается прямо на странице: ничего ставить не нужно. Если что-то непонятно — жми «Не понял», там объяснение попроще и пример на других данных.`));
    col.append(cell({ code: 'name = "мир"\nprint(f"Привет, {name}! Это настоящий Python.")\nprint(2 ** 100)\n' }));
    const paths = el('div', 'paths');
    ORDER.forEach(k => {
      const lv = LEVELS[k], nx = nextLesson(k), dn = cntDone(k), tot = cnt(k);
      const a = el('a', 'path ' + k, `<h2>${lv.name}</h2><p>${esc(lv.desc)}</p><span class="stat">${lv.lessons.length} уроков · ${dn}/${tot} заданий</span><div class="bar2"><i style="width:${tot ? dn / tot * 100 : 0}%"></i></div>`);
      a.href = '#/' + nx.id;
      paths.append(a);
    });
    col.append(paths);
    col.append(el('p', null, `Не знаешь, с какого уровня начать? <a href="#/test">Пройди короткий тест</a>, это 8 вопросов.`));
    col.append(el('h2', 'h2l', `Уроки уровня «${LEVELS[level].name}»`));
    const ol = el('ol', 'toc');
    lessonsOf(level).forEach((l, i) => {
      const li = el('li'); const a = el('a', null, `<span class="n">${i + 1}</span><span><b>${esc(l.title)} ${isFin(l) ? '<span class="ck">✓</span>' : ''}</b><span class="d">${esc(l.blurb)}</span></span>`);
      a.href = '#/' + l.id; li.append(a); ol.append(li);
    });
    col.append(ol);
    app.append(col);
  }

  function lesson(id) {
    const l = ALL.find(x => x.id === id);
    if (!l) return home();
    if (l.level !== level) { level = l.level; ls.set('pycourse_level', level); }
    const list = lessonsOf(level), i = list.indexOf(l);
    document.title = `${l.title} · Python с нуля`;
    app.innerHTML = '';
    const col = el('article', 'col lesson');
    col.append(el('div', 'crumbs', `<span class="chip ${l.level}">${LEVELS[l.level].name}</span><span>Урок ${i + 1} из ${list.length}</span>`));
    col.append(el('h1', null, esc(l.title)), el('p', 'lead', esc(l.lead)));
    renderBlocks(col, l);
    finishBox = el('div'); col.append(finishBox);
    const pager = el('div', 'pager');
    if (i > 0) { const a = el('a', 'prev', `<small>Назад</small>${esc(list[i - 1].title)}`); a.href = '#/' + list[i - 1].id; pager.append(a); }
    if (i < list.length - 1) { const a = el('a', 'next', `<small>Дальше</small>${esc(list[i + 1].title)}`); a.href = '#/' + list[i + 1].id; pager.append(a); }
    col.append(pager); app.append(col);
    refreshFinish();
  }

  function refreshFinish() {
    if (!finishBox) return;
    const l = ALL.find(x => x.id === curId()); if (!l) return;
    const list = lessonsOf(l.level);
    if (list.every(isFin)) {
      const other = l.level === 'trainee' ? 'junior' : null;
      finishBox.className = 'finish';
      finishBox.innerHTML = `<h3>Уровень «${LEVELS[l.level].name}» пройден</h3><p>Все задания выполнены. ${other ? `Дальше — уровень «${LEVELS[other].name}»: <a href="#/${lessonsOf(other)[0].id}">начать</a>.` : 'Теперь свой проект: бот, парсер или сайт. И выкладывай его на GitHub — это твоё портфолио.'}</p>`;
    } else if (isFin(l)) {
      finishBox.className = 'finish';
      finishBox.innerHTML = '<h3>Урок пройден</h3><p>Все задания этого урока выполнены.</p>';
    } else { finishBox.className = ''; finishBox.innerHTML = ''; }
  }

  function placement() {
    document.title = 'Тест уровня · Python с нуля';
    app.innerHTML = '';
    const Qs = COURSE.placement;
    const col = el('div', 'col lesson placement');
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
    app.append(col);
  }

  function route() {
    const id = curId();
    if (id === 'test') placement(); else if (id) lesson(id); else home();
    renderSide(); closeMenu(); window.scrollTo(0, 0);
  }

  const menuBtn = $('#menuBtn');
  menuBtn.innerHTML = ic('menu') + 'Уроки';
  function closeMenu() { side.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.onclick = () => { const o = side.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(o)); };
  document.addEventListener('click', e => { if (side.classList.contains('open') && !side.contains(e.target) && !menuBtn.contains(e.target)) closeMenu(); });
  window.addEventListener('hashchange', route);
  route();
})();
