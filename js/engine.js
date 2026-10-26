/* Python в воркере (Pyodide): бесконечный цикл можно убить по таймауту */
const PyEngine = (() => {
  const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  const TIMEOUT_MS = 8000;

  function workerMain() {
    importScripts('__PYODIDE__pyodide.js');
    const ready = loadPyodide({ indexURL: '__PYODIDE__' });
    ready.then(() => postMessage({ type: 'ready' }), e => postMessage({ type: 'fail', msg: String(e) }));
    onmessage = async e => {
      const { id, code, test, stdin } = e.data;
      let py;
      try { py = await ready; } catch (err) { postMessage({ type: 'result', id, ok: false, fail: true, out: '', error: String(err) }); return; }
      postMessage({ type: 'started', id });
      let out = '';
      const lines = stdin ? stdin.split('\n') : [];
      py.setStdout({ batched: s => { out += s + '\n'; } });
      py.setStderr({ batched: s => { out += s + '\n'; } });
      py.setStdin({ stdin: () => (lines.length ? lines.shift() : undefined) });
      const ns = py.globals.get('dict')();
      ns.set('__src__', code);
      const res = { type: 'result', id, ok: true };
      try { await py.runPythonAsync(code, { globals: ns }); }
      catch (err) { res.ok = false; res.error = String(err.message || err); }
      if (res.ok && test) {
        try { await py.runPythonAsync(test, { globals: ns }); res.passed = true; }
        catch (err) { res.passed = false; res.testError = String(err.message || err); }
      }
      ns.destroy();
      res.out = out;
      postMessage(res);
    };
  }

  let worker = null, jobs = new Map(), seq = 0;
  function spawn() {
    const src = '(' + workerMain.toString().replace(/__PYODIDE__/g, PYODIDE) + ')()';
    worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
    worker.onmessage = e => {
      const m = e.data;
      if (m.type === 'started') { const j = jobs.get(m.id); if (j) { j.onStart(); j.timer = setTimeout(() => kill(m.id), TIMEOUT_MS); } }
      else if (m.type === 'result') { const j = jobs.get(m.id); if (j) { clearTimeout(j.timer); jobs.delete(m.id); j.resolve(m); } }
      else if (m.type === 'fail') { failAll(m.msg); }
    };
    worker.onerror = () => failAll('worker');
  }
  function failAll(msg) {
    for (const [, j] of jobs) { clearTimeout(j.timer); j.resolve({ ok: false, fail: true, out: '', error: msg }); }
    jobs.clear(); if (worker) worker.terminate(); worker = null;
  }
  function kill(id) {
    const j = jobs.get(id); if (!j) return;
    jobs.delete(id); j.resolve({ ok: false, timeout: true, out: '' });
    if (worker) worker.terminate(); worker = null;
    for (const [, o] of jobs) { clearTimeout(o.timer); o.resolve({ ok: false, timeout: true, out: '' }); }
    jobs.clear();
  }
  function run(code, test, stdin, onStart) {
    if (!worker) spawn();
    const id = ++seq;
    return new Promise(resolve => {
      jobs.set(id, { resolve, onStart });
      worker.postMessage({ id, code, test, stdin });
    });
  }
  return { run, warm() { if (!worker) spawn(); }, get loaded() { return !!worker; } };
})();
