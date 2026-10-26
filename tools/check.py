"""Проверка уроков настоящим Python.

Для каждого задания: решение должно проходить тест, а заготовка (starter) — нет.
Для каждого примера кода: он должен выполняться без ошибок (кроме помеченных fails).
Запуск: python tools/check.py
"""
import json, subprocess, sys, tempfile, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RUNNER = r'''
import sys, json, io
case = json.load(open(sys.argv[1], encoding="utf-8"))
sys.stdin = io.StringIO(case.get("stdin") or "")
ns = {"__name__": "__main__", "__src__": case["code"]}
try:
    exec(compile(case["code"], "<exec>", "exec"), ns)
    if case.get("test"):
        exec(compile(case["test"], "<test>", "exec"), ns)
except BaseException as e:
    print(f"{type(e).__name__}: {e}")
    sys.exit(1)
'''


def run(code, test=None, stdin=""):
    with tempfile.TemporaryDirectory() as d:
        (Path(d) / "case.json").write_text(json.dumps({"code": code, "test": test, "stdin": stdin}), encoding="utf-8")
        (Path(d) / "runner.py").write_text(RUNNER, encoding="utf-8")
        try:
            p = subprocess.run([sys.executable, "-I", "-X", "utf8", "runner.py", "case.json"], cwd=d, capture_output=True,
                               text=True, encoding="utf-8", errors="replace", timeout=20, input="")
        except subprocess.TimeoutExpired:
            return False, "таймаут"
        return p.returncode == 0, (p.stdout + p.stderr).strip()


def main():
    raw = subprocess.run(["node", str(ROOT / "tools" / "dump.js")], capture_output=True, text=True, encoding="utf-8", check=True).stdout
    data = json.loads(raw)
    bad, tasks, cells, ids = [], 0, 0, set()
    all_lessons = [l for lv in data["levels"].values() for l in lv["lessons"]]
    lesson_ids = {l["id"] for l in all_lessons}
    for q in data["placement"]:
        if q["lesson"] not in lesson_ids:
            bad.append(f"placement: нет урока {q['lesson']}")
    for l in all_lessons:
        for i, b in enumerate(l["blocks"]):
            where = f"{l['id']}#{i}"
            k = b["k"]
            if k in ("c", "e") or (k == "how" and b.get("code")):
                cells += 1
                ok, msg = run(b["code"], stdin=b.get("stdin", ""))
                if b.get("fails"):
                    if ok:
                        bad.append(f"{where}: пример должен падать, а не падает")
                elif not ok:
                    bad.append(f"{where}: пример упал: {msg.splitlines()[-1] if msg else ''}\n    {b['code'][:80]!r}")
            elif k == "t":
                tasks += 1
                if b["id"] in ids:
                    bad.append(f"{where}: дубль id {b['id']}")
                ids.add(b["id"])
                if b.get("test"):
                    ok, msg = run(b["solution"], b["test"], b.get("stdin", ""))
                    if not ok:
                        bad.append(f"{b['id']}: решение не проходит тест: {msg}")
                    ok, msg = run(b["starter"], b["test"], b.get("stdin", ""))
                    if ok:
                        bad.append(f"{b['id']}: заготовка проходит тест без правок")
                else:
                    if not b.get("free"):
                        bad.append(f"{b['id']}: нет test и не free")
                    ok, msg = run(b["solution"], stdin=b.get("stdin", ""))
                    if not ok:
                        bad.append(f"{b['id']}: решение free-задания упало: {msg}")
                    ok, msg = run(b["starter"], stdin=b.get("stdin", ""))
                    if not ok and not b["id"].startswith("hello"):
                        bad.append(f"{b['id']}: заготовка free-задания падает: {msg}")
    print(f"уроков: {len(all_lessons)}, заданий: {tasks}, примеров кода: {cells}")
    for lv in data["levels"].values():
        print(f"  {lv['name']}: {len(lv['lessons'])} уроков, " + str(sum(1 for l in lv['lessons'] for b in l['blocks'] if b['k'] == 't')) + " заданий")
    if bad:
        print(f"\nПРОБЛЕМ: {len(bad)}")
        for x in bad:
            print(" -", x)
        sys.exit(1)
    print("\nВсё в порядке")


if __name__ == "__main__":
    main()
