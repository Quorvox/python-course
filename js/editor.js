/* редактор кода с запуском: примеры и задания */
const App = { onProgress: [] };      // сюда страницы подписываются на «задание решено»

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
  root.append(el('div', 'cell-h', `<span class="dots"><i></i><i></i><i></i></span><span>${t ? 'решение.py' : 'пример.py'}</span><span class="py">Python 3.12</span>`));

  const ed = el('div', 'ed');
  const gut = el('pre', 'gut'); gut.setAttribute('aria-hidden', 'true');
  const inner = el('div', 'edin');
  const pre = el('pre'); const codeEl = el('code'); pre.append(codeEl); pre.setAttribute('aria-hidden', 'true');
  const ta = el('textarea');
  ta.value = code0; ta.spellcheck = false; ta.wrap = 'off';
  ta.setAttribute('aria-label', 'Код Python, можно править');
  ta.setAttribute('autocapitalize', 'off'); ta.setAttribute('autocomplete', 'off'); ta.setAttribute('autocorrect', 'off');
  const paint = () => {
    const n = ta.value.split('\n').length;
    codeEl.innerHTML = Highlight.html(ta.value) + '\n';
    ta.rows = Math.max(2, n);
    gut.textContent = Array.from({length: Math.max(2, n)}, (_, i) => i + 1).join('\n');
  };
  paint();
  ta.addEventListener('scroll', () => { pre.scrollLeft = ta.scrollLeft; });
  inner.append(pre, ta); ed.append(gut, inner);

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
    if (!t || Store.done[t.id]) return;
    Store.markTask(t.id); root.classList.add('done');
    $$('.badge[data-task="' + t.id + '"]').forEach(bd => { bd.textContent = 'готово'; bd.classList.add('ok'); });
    App.onProgress.forEach(f => f(t));
  };
  if (t && Store.done[t.id]) root.classList.add('done');

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

// статичный код с кнопкой «копировать» (команды терминала, конфиги, каркасы)
function kblock(b) {
  const root = el('div', 'kblock');
  const head = el('div', 'cell-h', `<span class="dots"><i></i><i></i><i></i></span><span>${esc(b.title || (b.lang === 'bash' ? 'терминал' : 'код'))}</span>`);
  const btn = el('button', 'copy', ic('copy') + 'копировать');
  btn.onclick = async () => {
    try { await navigator.clipboard.writeText(b.code); btn.innerHTML = ic('check') + 'скопировано'; }
    catch (e) { btn.textContent = 'не вышло'; }
    setTimeout(() => { btn.innerHTML = ic('copy') + 'копировать'; }, 1600);
  };
  head.append(btn);
  const pre = el('pre'); const code = el('code');
  code.innerHTML = b.lang === 'bash' || b.lang === 'text' ? esc(b.code) : Highlight.html(b.code);
  pre.append(code); root.append(head, pre);
  return root;
}
