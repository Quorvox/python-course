/* лёгкая подсветка Python для редактора (без библиотек) */
const Highlight = (() => {
  const KW = new Set('and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case'.split(' '));
  const CONST = new Set(['True', 'False', 'None', 'self', 'cls']);
  const BI = new Set('print input int float str bool list dict set tuple len range type sum min max abs round sorted reversed enumerate zip map filter any all open isinstance super property staticmethod classmethod iter next repr format id hash chr ord bin hex divmod pow vars dir getattr setattr hasattr callable frozenset bytes object Exception ValueError TypeError KeyError IndexError ZeroDivisionError NameError AttributeError StopIteration'.split(' '));
  const RE = /(#[^\n]*)|((?:[rRbBfF]{1,2})?(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?))|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(@[A-Za-z_]\w*)|([A-Za-z_]\w*)/g;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function html(src) {
    let out = '', last = 0, prev = '';
    src.replace(RE, (m, com, str, num, dec, id, off) => {
      out += esc(src.slice(last, off));
      last = off + m.length;
      let cls = null;
      if (com) cls = 'com';
      else if (str) cls = 'str';
      else if (num) cls = 'num';
      else if (dec) cls = 'dec';
      else if (id) {
        if (prev === 'def' || prev === 'class') cls = 'fn';
        else if (KW.has(id)) cls = 'kw';
        else if (CONST.has(id)) cls = 'const';
        else if (BI.has(id)) cls = 'bi';
        prev = id;
      }
      if (!id) prev = '';
      out += cls ? `<span class="tk-${cls}">${esc(m)}</span>` : esc(m);
      return m;
    });
    return out + esc(src.slice(last));
  }
  return { html };
})();
