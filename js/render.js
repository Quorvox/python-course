/* отрисовка блоков уроков и страниц */
const DIFF = {1:'лёгкое', 2:'среднее', 3:'сложное'};

function quiz(b) {
  const root = el('div', 'quiz');
  root.append(el('div', 'qh', ic('quiz') + 'Проверь себя'), el('p', 'q', fmt(b.q)));
  const box = el('div', 'opts');
  const why = el('p', 'why'); why.hidden = true;
  const btns = b.opts.map((o, i) => {
    const x = el('button', 'opt', fmt(o));
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

// карточка задания: условие, пример «вход → выход», разбор по шагам, редактор
function taskCard(t, n) {
  const p = { ...(COURSE.plans[t.id] || {}) };
  if (t.ex) p.ex = t.ex;
  if (t.plan) p.plan = t.plan;
  const d = t.d || p.lvl || (t.star ? 3 : 1);
  const root = el('section', 'task-card');
  root.id = 'task-' + t.id;
  const title = t.title ? esc(t.title) : `Задание ${n}`;
  root.append(el('div', 'task-h', `<span>${title}</span><span class="badge d${d}">${DIFF[d]}${d === 3 ? ' ★' : ''}</span><span class="badge ${Store.done[t.id] ? 'ok' : ''}" data-task="${t.id}">${Store.done[t.id] ? 'готово' : 'не выполнено'}</span>`));
  root.append(el('p', 'task-text', fmt(t.text)));
  if (p.ex && p.ex.length) {
    const ex = el('div', 'ex', `<b>${p.ex.length > 1 ? 'Примеры' : 'Пример'}</b>`);
    p.ex.forEach(line => {
      const parts = line.split('  →  ');
      ex.append(el('div', null, parts.map(esc).join('<span class="arrow">→</span>')));
    });
    root.append(ex);
  }
  if (t.test && !t.free && /\bexec\(/.test(t.test)) {
    root.append(el('div', 'inj', ic('eye') + '<span>Проверка запускает твой код на других значениях исходных переменных. Пиши решение для любых данных, а не под один пример.</span>'));
  }
  if (p.plan && p.plan.length) {
    const dt = el('details', 'plan');
    dt.append(el('summary', null, ic('map') + 'Не понял задание? Разберём по шагам' + ic('chev', 'chev')));
    const body = el('div', 'dbody');
    const ol = el('ol', 'steps'); p.plan.forEach(s => ol.append(el('li', null, fmt(s))));
    body.append(ol);
    if (p.note) body.append(el('p', null, fmt(p.note)));
    dt.append(body); root.append(dt);
  }
  root.append(cell(t, t));
  return root;
}

function cardsBlock(items) {
  const g = el('div', 'cards');
  items.forEach(it => {
    const a = el(it.url || it.href ? 'a' : 'div', 'card');
    if (it.url) { a.href = it.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    else if (it.href) a.href = it.href;
    a.innerHTML = `<h3>${esc(it.title)}</h3>${it.by ? `<div class="by">${esc(it.by)}</div>` : ''}<p>${fmt(it.text || '')}</p>` +
      (it.tags ? `<div class="meta">${it.tags.map(t => `<span class="badge">${esc(t)}</span>`).join('')}</div>` : '') +
      (it.url ? `<span class="go">Открыть ${ic('arrow')}</span>` : '');
    g.append(a);
  });
  return g;
}

// возвращает список заголовков для оглавления справа
function renderBlocks(col, blocks) {
  let n = 0, hi = 0; const heads = [];
  for (const b of blocks) {
    switch (b.k) {
      case 'p': col.append(el('p', null, fmt(b.x))); break;
      case 's': { const h = el('h2', null, esc(b.x)); h.id = 'h' + (++hi); heads.push({ id: h.id, text: b.x }); col.append(h); break; }
      case 'h3': col.append(el('h3', null, esc(b.x))); break;
      case 'n': col.append(el('div', 'box', ic('bulb') + '<div>' + fmt(b.x) + '</div>')); break;
      case 'w': col.append(el('div', 'box warn', ic('warn') + '<div>' + fmt(b.x) + '</div>')); break;
      case 'l': col.append(el('ul', 'ls', b.items.map(i => '<li>' + fmt(i) + '</li>').join(''))); break;
      case 'tb': col.append(el('div', 'tbl', '<table><thead><tr>' + b.head.map(h => '<th>' + fmt(h) + '</th>').join('') + '</tr></thead><tbody>' +
        b.rows.map(r => '<tr>' + r.map(c => '<td>' + fmt(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>')); break;
      case 'c': col.append(cell(b)); break;
      case 'k': col.append(kblock(b)); break;
      case 'e': col.append(helpBox(b)); break;
      case 'how': col.append(howBox(b)); break;
      case 'q': col.append(quiz(b)); break;
      case 'cards': col.append(cardsBlock(b.items)); break;
      case 't': col.append(taskCard(b, ++n)); break;
    }
  }
  return heads;
}
