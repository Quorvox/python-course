// выгружает уроки в JSON для проверки: node tools/dump.js > lessons.json
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="(js\/(?:helpers\.js|content\/[^"]+))"/g)].map(m => m[1]);
const ctx = vm.createContext({});
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
process.stdout.write(vm.runInContext('JSON.stringify({levels: COURSE.levels, placement: COURSE.placement})', ctx));
