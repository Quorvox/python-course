// выгружает контент курса в JSON для проверки: node tools/dump.js > course.json
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="(js\/(?:helpers\.js|content\/[^"]+))"/g)].map(m => m[1]);
const ctx = vm.createContext({});
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
// проверяем и регулярки словаря: они собираются в браузере с флагом u
vm.runInContext(`COURSE.glossary.forEach(g => { if (g.rx) { try { new RegExp('(?<![\\\\p{L}\\\\d_])(?:' + g.rx + ')', 'iu'); } catch (e) { g.rxError = String(e); } } })`, ctx);
process.stdout.write(vm.runInContext('JSON.stringify(COURSE)', ctx));
