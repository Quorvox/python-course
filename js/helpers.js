/* конструкторы блоков для уроков + реестр курса */
const P = x => ({k:'p', x});                                  // абзац
const S = x => ({k:'s', x});                                  // заголовок раздела
const N = x => ({k:'n', x});                                  // совет
const W = x => ({k:'w', x});                                  // частая ошибка
const L = items => ({k:'l', items});                          // маркированный список
const TB = (head, rows) => ({k:'tb', head, rows});            // таблица
const C = (code, o = {}) => ({k:'c', code:code.trim() + "\n", ...o});   // живой код
const T = o => ({k:'t', ...o, starter:o.starter.trim() + "\n"});        // задание
// «Не понял»: объяснение как пятилетнему + пример на других данных
const E = o => ({k:'e', ...o, code:o.code.trim() + "\n"});
// «Как это работает»: шаги по порядку
const HOW = (title, steps, code) => ({k:'how', title, steps, code: code ? code.trim() + "\n" : null});
// вопрос с вариантами: ans — индекс верного
const Q = (q, opts, ans, why) => ({k:'q', q, opts, ans, why});

const COURSE = {
  levels: {
    trainee: {id:'trainee', name:'Стажёр', tag:'с нуля', desc:'Никогда не программировал или только начал. Объясняем каждый шаг и каждое слово.', lessons:[]},
    junior:  {id:'junior',  name:'Джун',   tag:'уже шаришь', desc:'База есть: циклы, списки, функции. Дальше — ООП, генераторы, декораторы, тесты и чистый код.', lessons:[]},
  },
  add(level, lesson) { this.levels[level].lessons.push({...lesson, level}); }
};
