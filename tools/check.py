"""Проверка курса настоящим Python.

Для каждого задания: решение обязано проходить тест, а заготовка (starter) — нет.
Для каждого примера кода: он должен выполняться без ошибок (кроме помеченных fails).
Дополнительно: ссылки между уроками, словарь, разборы заданий, проекты, итоги уроков.
Запуск: python tools/check.py
"""
import ast, json, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor
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
# примеры словаря, которые не Python (команды и конфиги)
NOT_PY = {'linter', 'interpreter', 'pip', 'venv', 'terminal', 'git', 'commit', 'gitignore', 'requirements', 'readme'}


def run(code, test=None, stdin=""):
    with tempfile.TemporaryDirectory() as d:
        (Path(d) / "case.json").write_text(json.dumps({"code": code, "test": test, "stdin": stdin}), encoding="utf-8")
        (Path(d) / "runner.py").write_text(RUNNER, encoding="utf-8")
        try:
            p = subprocess.run([sys.executable, "-I", "-X", "utf8", "runner.py", "case.json"], cwd=d, capture_output=True,
                               text=True, encoding="utf-8", errors="replace", timeout=40, input="")
        except subprocess.TimeoutExpired:
            return False, "таймаут"
        return p.returncode == 0, ((p.stdout or "") + (p.stderr or "")).strip()


def main():
    raw = subprocess.run(["node", str(ROOT / "tools" / "dump.js")], capture_output=True, text=True, encoding="utf-8", check=True).stdout
    data = json.loads(raw)
    bad, jobs, ids, counts = [], [], {}, {"tasks": 0, "cells": 0}
    levels = data["levels"]
    lessons = [l for lv in levels.values() for l in lv["lessons"]]
    pages = data["pages"]
    topics = {t["id"] for t in data["topics"]}
    lesson_ids = {l["id"] for l in lessons}
    ref_ids = lesson_ids | set(pages)
    reserved = {"test", "start", "practice", "projects", "proj", "glossary", "books", "vscode", "cheats"}
    for i in lesson_ids & reserved:
        bad.append(f"id урока занят маршрутом: {i}")
    if len(lesson_ids) != len(lessons):
        bad.append("дубли id уроков")

    def add_job(where, code, test=None, stdin="", expect_fail=False, what="пример", task=None):
        jobs.append((where, code, test, stdin, expect_fail, what, task))

    def scan_blocks(owner, blocks):
        for i, b in enumerate(blocks):
            where = f"{owner}#{i}"
            k = b["k"]
            if k in ("c", "e") or (k == "how" and b.get("code")):
                counts["cells"] += 1
                add_job(where, b["code"], stdin=b.get("stdin", ""), expect_fail=bool(b.get("fails")))
            elif k == "k" and b.get("lang") == "python":
                try:
                    ast.parse(b["code"])
                except SyntaxError as e:
                    bad.append(f"{where}: код в K не парсится: {e}")
            elif k == "t":
                scan_task(where, b)
            elif k == "q":
                if not 0 <= b["ans"] < len(b["opts"]):
                    bad.append(f"{where}: индекс верного ответа вне вариантов")

    def scan_task(where, b):
        counts["tasks"] += 1
        tid = b["id"]
        if tid in ids:
            bad.append(f"{where}: дубль id задания {tid} (уже в {ids[tid]})")
        ids[tid] = where
        if b.get("test"):
            add_job(tid, b["solution"], b["test"], b.get("stdin", ""), what="решение", task=tid)
            add_job(tid, b["starter"], b["test"], b.get("stdin", ""), expect_fail=True, what="заготовка", task=tid)
        else:
            if not b.get("free"):
                bad.append(f"{tid}: нет test и не free")
            add_job(tid, b["solution"], stdin=b.get("stdin", ""), what="решение free")

    for l in lessons:
        scan_blocks(l["id"], l["blocks"])
        if l["id"] not in data["recaps"]:
            bad.append(f"{l['id']}: нет итогов урока (recaps.js)")
    for pid, pg in pages.items():
        scan_blocks("страница " + pid, pg["blocks"])
    for t in data["practice"]:
        if t["topic"] not in topics:
            bad.append(f"{t['id']}: неизвестная тема {t['topic']}")
        scan_task(t["id"], t)
    for p in data["projects"]:
        if p["id"] in ids:
            bad.append(f"дубль id проекта {p['id']}")
        ids[p["id"]] = "проект"
        add_job("проект " + p["id"], p["demo"], stdin=p.get("stdin", ""))
        counts["cells"] += 1
        for n in p.get("needs", []):
            if n not in lesson_ids:
                bad.append(f"проект {p['id']}: нет урока {n}")
        for i, s in enumerate(p["stages"]):
            if s.get("code") and p["id"] != "converter" or (s.get("code") and "requests" in s["code"]):
                try:
                    ast.parse(s["code"])
                except SyntaxError as e:
                    if not s["code"].startswith("BOT_TOKEN"):
                        bad.append(f"проект {p['id']} этап {i + 1}: код не парсится: {e}")
    # словарь
    gids = set()
    for g in data["glossary"]:
        if g["id"] in gids:
            bad.append(f"словарь: дубль {g['id']}")
        gids.add(g["id"])
        if g.get("rxError"):
            bad.append(f"словарь {g['id']}: плохая регулярка: {g['rxError']}")
        for n in g.get("lessons") or []:
            if n not in ref_ids:
                bad.append(f"словарь {g['id']}: нет урока или страницы {n}")
        if g.get("ex") and g["id"] not in NOT_PY:
            try:
                ast.parse(g["ex"])
            except SyntaxError as e:
                bad.append(f"словарь {g['id']}: пример не парсится: {e}")
    # разборы заданий
    for where, tid in ids.items():
        pass
    all_tasks = [(tid, w) for tid, w in ids.items() if w != "проект"]
    for tid, w in all_tasks:
        pass
    for tid in data["plans"]:
        if tid not in ids:
            bad.append(f"разбор для несуществующего задания {tid}")
    for l in lessons:
        for b in l["blocks"]:
            if b["k"] == "t" and b["id"] not in data["plans"]:
                bad.append(f"{b['id']}: нет разбора и примера (plans.js)")
    for t in data["practice"]:
        if not t.get("plan") or not t.get("ex"):
            bad.append(f"{t['id']}: у практики нет plan или ex")
    for pl in data["placement"]:
        if pl["lesson"] not in ref_ids:
            bad.append(f"тест уровня: нет урока {pl['lesson']}")

    def work(j):
        where, code, test, stdin, expect_fail, what, task = j
        ok, msg = run(code, test, stdin)
        if expect_fail:
            if what == "заготовка":
                return f"{where}: заготовка проходит тест без правок" if ok else None
            return f"{where}: пример должен падать, а не падает" if ok else None
        return None if ok else f"{where}: {what} упало: {msg.splitlines()[-1] if msg else ''}"

    with ThreadPoolExecutor(max_workers=8) as ex:
        for r in ex.map(work, jobs):
            if r:
                bad.append(r)

    print(f"уроков: {len(lessons)}, заданий в уроках и практике: {counts['tasks']}, примеров кода: {counts['cells'] + len(data['projects'])}, "
          f"терминов: {len(data['glossary'])}, проектов: {len(data['projects'])}, практики: {len(data['practice'])}, страниц: {len(pages)}")
    for lv in levels.values():
        n = sum(1 for l in lv['lessons'] for b in l['blocks'] if b['k'] == 't')
        print(f"  {lv['name']}: {len(lv['lessons'])} уроков, {n} заданий")
    if bad:
        print(f"\nПРОБЛЕМ: {len(bad)}")
        for x in bad:
            print(" -", x)
        sys.exit(1)
    print("\nВсё в порядке")


if __name__ == "__main__":
    main()
