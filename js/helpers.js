/* конструкторы блоков для уроков + реестр курса */
const P = x => ({k:'p', x});                                  // абзац
const S = x => ({k:'s', x});                                  // заголовок раздела
const H3 = x => ({k:'h3', x});                                // подзаголовок
const N = x => ({k:'n', x});                                  // совет
const W = x => ({k:'w', x});                                  // частая ошибка
const L = items => ({k:'l', items});                          // маркированный список
const TB = (head, rows) => ({k:'tb', head, rows});            // таблица
const C = (code, o = {}) => ({k:'c', code:code.trim() + "\n", ...o});   // живой код
const K = (code, o = {}) => ({k:'k', code:code.trim() + "\n", ...o});   // статичный код (команды, конфиги), с кнопкой «копировать»
const CARDS = items => ({k:'cards', items});                  // карточки-ссылки
const T = o => ({k:'t', ...o, starter:o.starter.trim() + "\n"});        // задание
// «Не понял»: объяснение как пятилетнему + пример на других данных
const E = o => ({k:'e', ...o, code:o.code.trim() + "\n"});
// «Как это работает»: шаги по порядку
const HOW = (title, steps, code) => ({k:'how', title, steps, code: code ? code.trim() + "\n" : null});
// вопрос с вариантами: ans — индекс верного
const Q = (q, opts, ans, why) => ({k:'q', q, opts, ans, why});

// Задание на функцию: заготовка и тест собираются из таблицы случаев.
// cases — пары [«аргументы как код Python», «ожидаемое как код Python»], напр. ['3, 4', '7'].
// Первые случаи показываются ученику как примеры «вызов → результат».
const F = o => {
  const fn = o.sig.slice(0, o.sig.indexOf('('));
  const rows = o.cases.map(([a, r]) => `    (${JSON.stringify(fn + '(' + a + ')')}, ${r}),`).join('\n');
  const test = `_cases = [\n${rows}\n]\nfor _call, _want in _cases:\n    _got = eval(_call)\n    assert _got == _want, f"{_call} должна вернуть {_want!r}, а у тебя {_got!r}"\n` + (o.extra ? o.extra.trim() + '\n' : '');
  return {k:'t', id:o.id, topic:o.topic, d:o.d || 1, title:o.title, star:o.d === 3, text:o.text, hint:o.hint,
    starter:(o.starter || `def ${o.sig}:\n    pass`).trim() + "\n", test, solution:o.solution.trim() + "\n",
    ex:o.cases.slice(0, o.shows || 3).map(([a, r]) => `${fn}(${a})  →  ${r}`), plan:o.plan};
};

const COURSE = {
  levels: {
    trainee: {id:'trainee', name:'Стажёр', tag:'с нуля', desc:'Никогда не программировал или только начал. Объясняем каждый шаг и каждое слово.', lessons:[]},
    junior:  {id:'junior',  name:'Джун',   tag:'уже шаришь', desc:'База есть: циклы, списки, функции. Дальше — ООП, генераторы, декораторы, тесты и чистый код.', lessons:[]},
  },
  plans:{}, recaps:{}, glossary:[], projects:[], practice:[], pages:{}, topics:[],
  add(level, lesson) { this.levels[level].lessons.push({...lesson, level}); }
};
