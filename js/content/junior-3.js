/* Джун, часть 3: алгоритмы, текст и даты, чистый код и тесты, итоговый проект */

COURSE.add('junior', {
  id:'j-algo', title:'Рекурсия и алгоритмы', blurb:'Рекурсия, бинарный поиск, сортировки и как оценивать скорость.',
  lead:'Задачи с собеседований: не заучивать, а понимать. Разберём три главные идеи.',
  blocks:[
    S('Рекурсия'),
    P(String.raw`Рекурсия — это когда функция вызывает саму себя, но на **более простых** данных. У любой рекурсии два обязательных элемента: **базовый случай** (когда пора остановиться) и **шаг** (сведение задачи к меньшей).`),
    C(String.raw`
def factorial(n):
    if n <= 1:              # базовый случай
        return 1
    return n * factorial(n - 1)   # шаг: задача стала меньше

print(factorial(5))

def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])

print(total([1, 2, 3, 4]))`),
    E({say:String.raw`Русская матрёшка. Хочешь узнать, что в самой маленькой? Открой большую — внутри матрёшка поменьше. Открой её — там ещё меньше. И так до самой крошечной, которая внутри не открывается: это и есть **базовый случай**. Без неё ты бы открывал матрёшки бесконечно, и Python в конце концов закричит «RecursionError: стек переполнен».`,
      title:'Матрёшка из чисел: сколько цифр у числа',
      code:String.raw`
def digits(n):
    if n < 10:              # одна цифра: дальше открывать нечего
        return 1
    return 1 + digits(n // 10)    # откусили одну цифру

print(digits(7))
print(digits(98765))`}),
    HOW('Как выполняется factorial(3)', [
      '‹factorial(3)› хочет посчитать ‹3 * factorial(2)› и вызывает ‹factorial(2)›, оставаясь в ожидании.',
      '‹factorial(2)› хочет ‹2 * factorial(1)› и тоже ждёт.',
      '‹factorial(1)› — базовый случай, сразу возвращает ‹1›.',
      'Теперь ожидавшие «просыпаются» по цепочке: ‹2 * 1 = 2›, затем ‹3 * 2 = 6›.',
      'Каждый вызов занимает место в «стеке вызовов». Слишком глубокая рекурсия (около 1000 уровней) даёт ‹RecursionError›.'
    ], String.raw`
def f(n):
    print("вход", n)
    if n == 1:
        return 1
    r = n * f(n - 1)
    print("выход", n, "->", r)
    return r

f(3)`),
    W(String.raw`Две типичные ошибки: забыли базовый случай (бесконечная рекурсия) или не уменьшаем данные на шаге (то же самое). Если есть простое решение циклом, берут цикл: он быстрее и не упирается в глубину. Рекурсия хороша для деревьев, вложенных структур и перебора.`),
    S('Мемоизация'),
    P(String.raw`Наивный Фибоначчи пересчитывает одно и то же миллионы раз. Запоминать уже посчитанное — мемоизация. Мы уже видели ‹@lru_cache›; вручную это словарь.`),
    C(String.raw`
def fib_slow(n):
    return n if n < 2 else fib_slow(n - 1) + fib_slow(n - 2)

def fib_fast(n, memo={}):
    if n in memo:
        return memo[n]
    memo[n] = n if n < 2 else fib_fast(n - 1) + fib_fast(n - 2)
    return memo[n]

print(fib_slow(22))
print(fib_fast(90))`),
    S('Бинарный поиск'),
    P(String.raw`Ищем число в **отсортированном** списке. Вместо перебора всех — смотрим на середину: если искомое меньше, отбрасываем правую половину, иначе левую. Так миллион элементов находится за ~20 шагов (O(log n)).`),
    C(String.raw`
def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

data = list(range(0, 1000, 3))
print(binary_search(data, 99), binary_search(data, 100))`),
    E({say:String.raw`Игра «угадай число от 1 до 100». Умный игрок всегда называет середину: «50?» — «Больше» — «75?» — «Меньше» — «62?»... Каждым вопросом он выкидывает половину вариантов. Вот и весь бинарный поиск: список обязан быть упорядочен, иначе «больше/меньше» ничего не говорит.`,
      title:'Сколько шагов надо для миллиона',
      code:String.raw`
import math
for n in [100, 1000, 1000000, 1000000000]:
    print(f"{n:>13,} элементов -> до {math.ceil(math.log2(n))} шагов")`}),
    S('Сортировки'),
    P(String.raw`В жизни пользуются встроенным ‹sorted› (быстрая гибридная сортировка Timsort, O(n log n)). Но принцип «разделяй и властвуй» нужно понимать. Сортировка слиянием: разрезали пополам, отсортировали половинки, слили.`),
    C(String.raw`
def merge(a, b):
    out, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    return out + a[i:] + b[j:]

def merge_sort(items):
    if len(items) <= 1:
        return items
    mid = len(items) // 2
    return merge(merge_sort(items[:mid]), merge_sort(items[mid:]))

print(merge_sort([5, 2, 9, 1, 5, 6, 0]))`),
    Q(String.raw`Сколько примерно шагов нужно бинарному поиску для списка из 1 000 000 элементов?`, ['1 000 000', '1 000', '20', '2'], 2, String.raw`Каждый шаг делит список пополам, а ‹log₂(1 000 000) ≈ 20›.`),

    T({id:'j-algo-sumdigits',
      text:'Напиши **рекурсивную** функцию ‹digit_sum(n)›, возвращающую сумму цифр неотрицательного числа (‹digit_sum(1234)› → 10). Циклы использовать нельзя.',
      starter:String.raw`
def digit_sum(n):
    pass`,
      hint:'Базовый случай: ‹n < 10› → вернуть ‹n›. Шаг: последняя цифра ‹n % 10› плюс ‹digit_sum(n // 10)›.',
      test:String.raw`
assert "for " not in __src__ and "while " not in __src__, "циклы использовать нельзя"
assert digit_sum(1234) == 10
assert digit_sum(0) == 0
assert digit_sum(7) == 7
assert digit_sum(99999) == 45`,
      solution:String.raw`
def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)`}),
    T({id:'j-algo-flatten',
      text:'Напиши рекурсивную ‹flatten(x)›: превращает вложенные списки любой глубины в один плоский список. ‹flatten([1, [2, [3, 4]], 5])› → ‹[1, 2, 3, 4, 5]›.',
      starter:String.raw`
def flatten(x):
    pass`,
      hint:'Идём по элементам. Если элемент — список (‹isinstance(el, list)›), расширяем результат ‹flatten(el)›, иначе добавляем сам элемент.',
      test:String.raw`
assert flatten([1, [2, [3, 4]], 5]) == [1, 2, 3, 4, 5]
assert flatten([]) == []
assert flatten([[[]]]) == []
assert flatten([[["a"]], "b"]) == ["a", "b"], "строки не разворачиваем"`,
      solution:String.raw`
def flatten(x):
    out = []
    for el in x:
        if isinstance(el, list):
            out.extend(flatten(el))
        else:
            out.append(el)
    return out`}),
    T({id:'j-algo-binary',
      text:'Напиши ‹bsearch(items, target)›: бинарный поиск по отсортированному списку, возвращает индекс или ‹-1›. Проверка считает шаги и не пропустит перебор по всему списку.',
      starter:String.raw`
def bsearch(items, target):
    pass`,
      hint:'Две границы ‹lo› и ‹hi›. Пока ‹lo <= hi›: возьми ‹mid›, сравни ‹items[mid]› с целью и сдвинь одну границу.',
      test:String.raw`
class Counting(list):
    reads = 0
    def __getitem__(self, i):
        Counting.reads += 1
        return super().__getitem__(i)

data = Counting(range(0, 100000, 2))
assert bsearch(data, 4242) == 2121
assert Counting.reads < 40, f"слишком много обращений к списку ({Counting.reads}), нужен бинарный поиск"
assert bsearch([1, 3, 5], 4) == -1
assert bsearch([], 1) == -1
assert bsearch([7], 7) == 0`,
      solution:String.raw`
def bsearch(items, target):
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`}),
    T({id:'j-algo-merge',
      text:'Напиши ‹merge_sorted(a, b)›: сливает два уже отсортированных списка в один отсортированный за один проход (без ‹sorted› и ‹sort›).',
      starter:String.raw`
def merge_sorted(a, b):
    pass`,
      hint:'Два указателя ‹i› и ‹j›. Берём меньший из ‹a[i]› и ‹b[j]›, двигаем соответствующий указатель. Когда один список кончился, добавляем хвост другого.',
      test:String.raw`
assert "sort" not in __src__.replace("merge_sorted", ""), "sorted / sort использовать нельзя"
assert merge_sorted([1, 4, 7], [2, 3, 9]) == [1, 2, 3, 4, 7, 9]
assert merge_sorted([], [1, 2]) == [1, 2]
assert merge_sorted([5], []) == [5]
assert merge_sorted([1, 1], [1]) == [1, 1, 1]`,
      solution:String.raw`
def merge_sorted(a, b):
    out, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    return out + a[i:] + b[j:]`}),
    T({id:'j-algo-hanoi',
      text:'Ханойские башни: переносим ‹n› дисков с одного стержня на другой, перекладывая по одному и не кладя большой на маленький. Напиши рекурсивную ‹hanoi(n)›, возвращающую **минимальное число ходов**. Подсказка: чтобы перенести ‹n› дисков, надо перенести ‹n-1› на запасной, переложить самый большой, и снова перенести ‹n-1›.',
      starter:String.raw`
def hanoi(n):
    pass`,
      hint:'Базовый случай: ‹n == 0› → 0 ходов. Шаг: ‹2 * hanoi(n - 1) + 1›.',
      test:String.raw`
assert [hanoi(n) for n in range(0, 6)] == [0, 1, 3, 7, 15, 31], f"получилось {[hanoi(n) for n in range(0, 6)]}"
assert hanoi(20) == 1048575`,
      solution:String.raw`
def hanoi(n):
    if n == 0:
        return 0
    return 2 * hanoi(n - 1) + 1`}),
    T({id:'j-algo-qsort', star:true,
      text:'Напиши быструю сортировку ‹quick_sort(items)›: выбери опорный элемент, разложи остальные на «меньше», «равны» и «больше» опорного, отсортируй рекурсивно крайние части и склей. Исходный список не менять, ‹sorted› / ‹.sort()› не использовать.',
      starter:String.raw`
def quick_sort(items):
    pass`,
      hint:'Если ‹len(items) <= 1› — вернуть как есть. Опорный: например, средний элемент. Три генератора списка: меньше, равные, больше. Ответ: ‹quick_sort(left) + equal + quick_sort(right)›.',
      test:String.raw`
import random
assert "sort(" not in __src__.replace("quick_sort(", ""), "sorted / sort использовать нельзя"
assert quick_sort([]) == []
assert quick_sort([3, 1, 2]) == [1, 2, 3]
src = [5, 3, 5, 1, 9, 3, 0]
orig = list(src)
assert quick_sort(src) == [0, 1, 3, 3, 5, 5, 9]
assert src == orig, "исходный список менять нельзя"
random.seed(1)
big = [random.randint(-100, 100) for _ in range(500)]
assert quick_sort(big) == sorted(big)`,
      solution:String.raw`
def quick_sort(items):
    if len(items) <= 1:
        return list(items)
    pivot = items[len(items) // 2]
    left = [x for x in items if x < pivot]
    equal = [x for x in items if x == pivot]
    right = [x for x in items if x > pivot]
    return quick_sort(left) + equal + quick_sort(right)`}),
  ]
});

COURSE.add('junior', {
  id:'j-text', title:'Текст, даты и регулярки', blurb:'re, strptime, timedelta, pathlib — повседневные инструменты.',
  lead:'Парсить логи, вытаскивать почты из текста, считать дни до дедлайна: то, что нужно в каждом втором проекте.',
  blocks:[
    S('Регулярные выражения'),
    P(String.raw`Регулярное выражение — это шаблон для поиска в тексте. Строки шаблонов пишут «сырыми» ‹r"..."›, чтобы Python не трогал обратные слэши.`),
    TB(['Символ', 'Значение'], [
      ['‹\\d›  ‹\\w›  ‹\\s›', 'цифра / буква-цифра-подчёркивание / пробельный'],
      ['‹.›', 'любой символ (кроме переноса)'],
      ['‹+›  ‹*›  ‹?›', 'один и более / ноль и более / ноль или один'],
      ['‹{3}›  ‹{2,5}›', 'ровно 3 / от 2 до 5 повторов'],
      ['‹[a-z]›  ‹[^0-9]›', 'один из набора / любой НЕ из набора'],
      ['‹( )›', 'группа: то, что внутри, можно достать отдельно'],
      ['‹^›  ‹$›', 'начало / конец строки'],
    ]),
    C(String.raw`
import re

text = "Звоните +49 151 2345678 или пишите ivan@mail.com, anna.k@site.org"

print(re.findall(r"[\w.]+@[\w.]+\.\w+", text))      # все email
print(re.search(r"\+\d+( \d+)+", text).group())    # первый телефон

m = re.search(r"(\d{2})\.(\d{2})\.(\d{4})", "Дедлайн 24.12.2026!")
day, month, year = m.groups()
print(day, month, year)

print(re.sub(r"\d", "#", "карта 1234 5678"))       # заменить цифры
print(re.split(r"[,;]\s*", "a, b;c,   d"))`),
    E({say:String.raw`Регулярка — это «поисковая маска» для текста, как трафарет. ‹\d› — «любая цифра», ‹+› — «одна или больше подряд». Шаблон ‹\d+› подставляется к тексту, и везде, где сквозь трафарет видны подряд идущие цифры, он находит совпадение. Скобки ‹( )› — это «вырезать окошко»: то, что оказалось внутри, можно достать отдельно.`,
      title:'Трафарет для хештегов и цен',
      code:String.raw`
import re
post = "Купил #python курс за 19.99 евро и #git за 5.50, всего 25.49"
print(re.findall(r"#\w+", post))
print(re.findall(r"\d+\.\d{2}", post))
print(re.sub(r"#(\w+)", r"[\1]", post))     # \1 = то, что в скобках`}),
    W(String.raw`Не пытайся регулярками разбирать HTML или полностью проверять e-mail по стандарту: шаблоны быстро превращаются в нечитаемую кашу. Для простых задач регулярки отличные, для сложных берут готовые парсеры.`),

    S('Даты и время'),
    P(String.raw`Модуль ‹datetime›: ‹date› — дата, ‹datetime› — дата и время, ‹timedelta› — промежуток. Из строки — ‹strptime›, в строку — ‹strftime› (коды: ‹%d› день, ‹%m› месяц, ‹%Y› год, ‹%H:%M› время, ‹%A› день недели).`),
    C(String.raw`
from datetime import datetime, date, timedelta

d = datetime.strptime("24.12.2026 18:30", "%d.%m.%Y %H:%M")
print(d.year, d.month, d.hour)
print(d.strftime("%Y-%m-%d"), d.weekday())          # 0 = понедельник

deadline = date(2026, 12, 31)
today = date(2026, 12, 1)
print((deadline - today).days, "дней до дедлайна")
print(today + timedelta(days=45))
print(d + timedelta(hours=7, minutes=45))`),
    N(String.raw`Храни и передавай даты в формате ISO ‹2026-12-24›: он сортируется как обычный текст и понятен всем системам. Показывать пользователю в его формате (‹24.12.2026› в Германии) — отдельным шагом.`),
    S('Пути и файлы: pathlib'),
    C(String.raw`
from pathlib import Path

folder = Path("demo_data")
folder.mkdir(exist_ok=True)
file = folder / "note.txt"              # слэш склеивает пути
file.write_text("раз\nдва\nтри\n", encoding="utf-8")

print(file.name, file.suffix, file.stem)
print(file.read_text(encoding="utf-8").splitlines())
print([p.name for p in folder.glob("*.txt")])
print(file.exists(), (folder / "нет.txt").exists())`),
    Q(String.raw`Что вернёт ‹re.findall(r"\d+", "а1 б22 в333")›?`, ['["1", "22", "333"]', '["1", "2", "2", "3", "3", "3"]', '["а1", "б22", "в333"]', '3'], 0, String.raw`‹\d+› берёт цепочку цифр подряд как одно совпадение, поэтому получаются три строки.`),

    T({id:'j-text-emails',
      text:'Напиши ‹find_emails(text)›: список всех адресов электронной почты в тексте в порядке появления (шаблон ‹[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+›, но так, чтобы ‹findall› вернул целые адреса: используй группу без захвата ‹(?:…)›).',
      starter:String.raw`
import re

def find_emails(text):
    pass`,
      hint:'‹re.findall(r"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+", text)›. ‹(?:…)› — группа, которая не меняет вид результата.',
      test:String.raw`
t = "Пиши на ivan@mail.com или anna.k+work@site.co.uk, а не на @nobody и plain.text."
assert find_emails(t) == ["ivan@mail.com", "anna.k+work@site.co.uk"], f"получилось {find_emails(t)}"
assert find_emails("ничего") == []`,
      solution:String.raw`
import re

def find_emails(text):
    return re.findall(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", text)`}),
    T({id:'j-text-phone',
      text:'Напиши ‹digits_phone(text)›: убирает из телефона всё, кроме цифр, и приводит российский номер к виду из 11 цифр, начинающихся с ‹7›: ‹"+7 (912) 345-67-89"› → ‹"79123456789"›, ‹"8 912 345 67 89"› → ‹"79123456789"›. Если цифр не 11 — ‹None›.',
      starter:String.raw`
import re

def digits_phone(text):
    pass`,
      hint:'‹re.sub(r"\\D", "", text)› оставляет только цифры. Потом если начинается на ‹8› и длина 11 — замени первую цифру на ‹7›.',
      test:String.raw`
assert digits_phone("+7 (912) 345-67-89") == "79123456789"
assert digits_phone("8 912 345 67 89") == "79123456789"
assert digits_phone("79123456789") == "79123456789"
assert digits_phone("12345") is None
assert digits_phone("") is None`,
      solution:String.raw`
import re

def digits_phone(text):
    d = re.sub(r"\D", "", text)
    if len(d) != 11:
        return None
    if d[0] == "8":
        d = "7" + d[1:]
    return d`}),
    T({id:'j-text-days',
      text:'Напиши ‹days_left(deadline, today)›: обе даты — строки ‹"дд.мм.гггг"›. Верни, сколько полных дней от ‹today› до ‹deadline› (отрицательное, если срок прошёл).',
      starter:String.raw`
from datetime import datetime

def days_left(deadline, today):
    pass`,
      hint:'Разбери обе строки через ‹datetime.strptime(s, "%d.%m.%Y")›, вычти и возьми ‹.days›.',
      test:String.raw`
assert days_left("31.12.2026", "01.12.2026") == 30
assert days_left("01.03.2028", "28.02.2028") == 2, "2028 — високосный"
assert days_left("01.01.2026", "11.01.2026") == -10
assert days_left("05.05.2026", "05.05.2026") == 0`,
      solution:String.raw`
from datetime import datetime

def days_left(deadline, today):
    fmt = "%d.%m.%Y"
    return (datetime.strptime(deadline, fmt) - datetime.strptime(today, fmt)).days`}),
    T({id:'j-text-log',
      text:'Напиши ‹parse_log(line)›: разбирает строку лога вида ‹2026-10-25 14:03:11 [ERROR] db: connection lost› и возвращает словарь с ключами ‹date›, ‹time›, ‹level›, ‹source›, ‹message›. Если строка не подходит под формат — ‹None›.',
      starter:String.raw`
import re

def parse_log(line):
    pass`,
      hint:'Шаблон с именованными группами: ‹(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<time>[\\d:]+) \\[(?P<level>\\w+)\\] (?P<source>\\w+): (?P<message>.*)›, затем ‹m.groupdict()›.',
      test:String.raw`
r = parse_log("2026-10-25 14:03:11 [ERROR] db: connection lost")
assert r == {"date": "2026-10-25", "time": "14:03:11", "level": "ERROR", "source": "db", "message": "connection lost"}, f"получилось {r}"
assert parse_log("мусор вместо лога") is None
assert parse_log("2026-10-25 09:00:00 [INFO] app: started: ok")["message"] == "started: ok"`,
      solution:String.raw`
import re

LOG = re.compile(r"(?P<date>\d{4}-\d{2}-\d{2}) (?P<time>[\d:]+) \[(?P<level>\w+)\] (?P<source>\w+): (?P<message>.*)")

def parse_log(line):
    m = LOG.fullmatch(line.strip())
    return m.groupdict() if m else None`}),
    T({id:'j-text-report', star:true,
      text:'Напиши ‹error_report(lines)›: принимает список строк лога (формат как выше) и возвращает словарь «источник → число ошибок уровня ERROR». Строки-мусор пропускай. Используй свою ‹parse_log› (скопируй её в решение).',
      starter:String.raw`
import re
from collections import Counter

def parse_log(line):
    m = re.fullmatch(r"(?P<date>\S+) (?P<time>\S+) \[(?P<level>\w+)\] (?P<source>\w+): (?P<message>.*)", line.strip())
    return m.groupdict() if m else None

def error_report(lines):
    pass`,
      hint:'Пройди по строкам, разбери каждую; если результат не ‹None› и ‹level == "ERROR"› — считай ‹source› в ‹Counter›. Верни ‹dict(counter)›.',
      test:String.raw`
lines = [
    "2026-10-25 14:03:11 [ERROR] db: connection lost",
    "2026-10-25 14:03:12 [INFO] app: retrying",
    "это не лог",
    "2026-10-25 14:03:13 [ERROR] db: timeout",
    "2026-10-25 14:03:14 [ERROR] api: 500",
    "2026-10-25 14:03:15 [WARNING] api: slow",
]
assert error_report(lines) == {"db": 2, "api": 1}, f"получилось {error_report(lines)}"
assert error_report([]) == {}`,
      solution:String.raw`
import re
from collections import Counter

def parse_log(line):
    m = re.fullmatch(r"(?P<date>\S+) (?P<time>\S+) \[(?P<level>\w+)\] (?P<source>\w+): (?P<message>.*)", line.strip())
    return m.groupdict() if m else None

def error_report(lines):
    c = Counter()
    for line in lines:
        r = parse_log(line)
        if r and r["level"] == "ERROR":
            c[r["source"]] += 1
    return dict(c)`}),
  ]
});

COURSE.add('junior', {
  id:'j-quality', title:'Чистый код и тесты', blurb:'Типы, свои исключения, assert, logging и разработка через тесты.',
  lead:'Код, который можно прочитать через полгода и не бояться трогать. То, чем отличается проект от «скрипта на коленке».',
  blocks:[
    S('Читаемость'),
    L([
      'Имена говорят, что внутри: ‹users_by_city›, а не ‹d2›. Функции — глаголы, классы — существительные, константы — ‹ЗАГЛАВНЫМИ›.',
      'Функция делает **одно** дело и умещается на экран. Не помещается — раздели.',
      'Нет «магических» чисел: ‹if age >= 18› лучше, когда ‹ADULT_AGE = 18› вынесено в константу.',
      'Ранний выход вместо пирамиды из ‹if›: сначала отсекаем плохие случаи ‹return›-ом, потом основной код без лишней вложенности.',
      'Комментарий объясняет **почему**, а не **что** (что видно из кода).',
    ]),
    C(String.raw`
# было: пирамида
def discount(user):
    if user is not None:
        if user["active"]:
            if user["orders"] > 10:
                return 0.2
            else:
                return 0.05
        else:
            return 0
    else:
        return 0

# стало: ранние выходы
BIG_CUSTOMER = 10

def discount2(user):
    if user is None or not user["active"]:
        return 0
    return 0.2 if user["orders"] > BIG_CUSTOMER else 0.05

print(discount({"active": True, "orders": 11}), discount2({"active": True, "orders": 11}))`),
    S('Аннотации типов'),
    P(String.raw`Подсказки типов не проверяются при запуске, но делают код понятнее, а редактор и инструмент ‹mypy› ловят по ним ошибки ещё до запуска.`),
    C(String.raw`
from typing import Optional

def average(nums: list[float]) -> float:
    return sum(nums) / len(nums)

def find_user(users: dict[int, str], uid: int) -> Optional[str]:
    return users.get(uid)          # str или None

def greet(name: str, times: int = 1) -> str:
    return (f"Привет, {name}! " * times).strip()

print(average([1, 2, 3.5]), find_user({1: "Аня"}, 2), greet("Коля", 2))`),
    S('Свои исключения'),
    P(String.raw`Для ошибок предметной области заведи свой класс-исключение. Тогда вызывающий код может поймать именно твою ошибку, а не гадать по тексту.`),
    C(String.raw`
class ShopError(Exception):
    """Базовая ошибка магазина."""

class OutOfStock(ShopError):
    def __init__(self, title, left):
        super().__init__(f"{title}: осталось {left}")
        self.title, self.left = title, left

stock = {"мышь": 2}

def buy(title, qty):
    left = stock.get(title, 0)
    if qty > left:
        raise OutOfStock(title, left)
    stock[title] = left - qty

try:
    buy("мышь", 5)
except OutOfStock as e:
    print("Не хватает:", e, "| есть", e.left)
except ShopError:
    print("другая ошибка магазина")`),
    S('Тесты: проверяем себя автоматически'),
    P(String.raw`Тест — это маленькая программа, которая вызывает твой код и сверяет результат с ожидаемым. Падает тест — значит, что-то сломалось. На работе тесты запускают на каждый коммит. Самый простой тест — ‹assert›; серьёзные проекты используют ‹pytest› или ‹unittest›.`),
    C(String.raw`
def slugify(title):
    return "-".join(title.lower().split())

def test_slugify():
    assert slugify("Hello World") == "hello-world"
    assert slugify("  много   пробелов ") == "много-пробелов"
    assert slugify("") == ""

test_slugify()
print("тесты прошли")`),
    C(String.raw`
import unittest

def is_leap(y):
    return y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)

class LeapTests(unittest.TestCase):
    def test_regular(self):
        self.assertTrue(is_leap(2024))
        self.assertFalse(is_leap(2023))

    def test_century(self):
        self.assertFalse(is_leap(1900))
        self.assertTrue(is_leap(2000))

suite = unittest.defaultTestLoader.loadTestsFromTestCase(LeapTests)
result = unittest.TextTestRunner(verbosity=0).run(suite)
print("все прошли:", result.wasSuccessful())`),
    HOW('TDD: сначала тест, потом код', [
      '**Красный.** Пишешь тест на функцию, которой ещё нет или которая не умеет нужного. Запускаешь — тест падает. Это нормально, это доказывает, что тест вообще что-то проверяет.',
      '**Зелёный.** Пишешь самый простой код, чтобы тест прошёл. Не красивый, а работающий.',
      '**Рефакторинг.** Приводишь код в порядок, перезапуская тесты после каждой правки. Если зелёные — ты ничего не сломал.',
      'Повторяешь для следующего требования. Так растёт программа, в которую не страшно вносить изменения.'
    ]),
    S('logging вместо print'),
    P(String.raw`Для сообщений «для разработчика» в серьёзных проектах используют ‹logging›: у сообщений есть уровни (DEBUG, INFO, WARNING, ERROR), время, источник, и вывод можно переключать в файл без правки кода.`),
    C(String.raw`
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(name)s | %(message)s", force=True)
log = logging.getLogger("shop")

log.debug("это не покажется: уровень ниже INFO")
log.info("заказ создан")
log.warning("осталось мало товара")
try:
    1 / 0
except ZeroDivisionError:
    log.exception("упали при расчёте")      # напишет и traceback`),
    Q(String.raw`Зачем в тестах пишут проверку «пограничных» случаев (пустая строка, 0, один элемент)?`, ['Чтобы тестов было больше', 'Ошибки чаще всего прячутся именно на границах', 'Это требует Python', 'Они быстрее выполняются'], 1, String.raw`Типичные баги — деление на ноль, пустой список, «лишний» элемент в цикле. Все они живут на границах.`),

    T({id:'j-q-exc',
      text:'Напиши иерархию: ‹ValidationError(Exception)› и её наследник ‹EmptyField(ValidationError)›, у которого есть поле ‹field› (имя пустого поля). Функция ‹validate(form)› (словарь) бросает ‹EmptyField›, если какое-то значение пусто (‹""› или ‹None›). Иначе возвращает ‹True›.',
      starter:String.raw`
class ValidationError(Exception):
    pass

def validate(form):
    pass`,
      hint:'Добавь ‹class EmptyField(ValidationError)› с ‹__init__(self, field)›, который вызывает ‹super().__init__(f"поле {field} пусто")› и сохраняет ‹self.field›. В ‹validate› пройди по ‹form.items()›.',
      test:String.raw`
assert issubclass(EmptyField, ValidationError)
assert validate({"name": "Аня", "age": 20}) is True
try:
    validate({"name": "Аня", "email": ""})
except EmptyField as e:
    assert e.field == "email", f"поле {e.field!r}, а ожидалось 'email'"
else:
    raise AssertionError("нужно бросить EmptyField")
try:
    validate({"x": None})
except ValidationError:
    pass
else:
    raise AssertionError("None тоже считается пустым")`,
      solution:String.raw`
class ValidationError(Exception):
    pass

class EmptyField(ValidationError):
    def __init__(self, field):
        super().__init__(f"поле {field} пусто")
        self.field = field

def validate(form):
    for name, value in form.items():
        if value is None or value == "":
            raise EmptyField(name)
    return True`}),
    T({id:'j-q-price',
      text:'Разработка через тесты: напиши ‹parse_price(text)›, которая разбирает цену из строки в число (‹float›). Требования — в тесте, все случаи ниже должны работать: ‹"19.99"›, ‹"19,99"›, ‹"1 234,50 €"›, ‹"€5"›, ‹"  7 "›. Мусор без цифр (‹"abc"›, ‹""›) → ‹ValueError›.',
      starter:String.raw`
def parse_price(text: str) -> float:
    pass`,
      hint:'Оставь только цифры, запятые и точки (например, через генератор по символам), запятую замени на точку, пробелы выброси. Если после чистки пусто — ‹raise ValueError›. Потом ‹float(...)›.',
      test:String.raw`
cases = {"19.99": 19.99, "19,99": 19.99, "1 234,50 €": 1234.5, "€5": 5.0, "  7 ": 7.0, "0": 0.0}
for raw, want in cases.items():
    got = parse_price(raw)
    assert got == want and isinstance(got, float), f"parse_price({raw!r}) = {got!r}, нужно {want!r}"
for bad in ["abc", "", "€", "   "]:
    try:
        parse_price(bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"parse_price({bad!r}) должна бросать ValueError")`,
      solution:String.raw`
def parse_price(text: str) -> float:
    cleaned = "".join(c for c in text if c.isdigit() or c in ",.")
    cleaned = cleaned.replace(",", ".")
    if not any(c.isdigit() for c in cleaned):
        raise ValueError(f"не цена: {text!r}")
    return float(cleaned)`}),
    T({id:'j-q-refactor',
      text:'Рефакторинг: функция ниже работает, но написана ужасно (пирамида, магические числа, одно имя ‹x›). Перепиши её читаемо **с тем же поведением**: ‹shipping(order)› возвращает стоимость доставки по правилам: нет заказа → 0; сумма ≥ 100 → 0 (бесплатно); иначе 5, а если страна не ‹"DE"› — 12.',
      starter:String.raw`
def shipping(x):
    if x:
        if x["sum"] < 100:
            if x["country"] == "DE":
                return 5
            else:
                return 12
        else:
            return 0
    else:
        return 0`,
      hint:'Ранние выходы: нет заказа или сумма ≥ порога → 0. Потом ‹return 5 if order["country"] == "DE" else 12›. Вынеси числа в константы ‹FREE_FROM›, ‹PRICE_DE›, ‹PRICE_WORLD›.',
      test:String.raw`
assert shipping(None) == 0
assert shipping({"sum": 100, "country": "DE"}) == 0
assert shipping({"sum": 99.99, "country": "DE"}) == 5
assert shipping({"sum": 10, "country": "FR"}) == 12
assert shipping({"sum": 500, "country": "US"}) == 0
src = __src__
assert "def shipping(x)" not in src, "переименуй параметр x во что-то понятное"
assert src.count("else:") <= 1, "убери пирамиду из else: используй ранние выходы"
assert any(w.isupper() and len(w) > 3 for w in __import__("re").findall(r"[A-Z_]+", src)), "вынеси числа в КОНСТАНТЫ"`,
      solution:String.raw`
FREE_FROM = 100
PRICE_DE = 5
PRICE_WORLD = 12

def shipping(order):
    if not order or order["sum"] >= FREE_FROM:
        return 0
    return PRICE_DE if order["country"] == "DE" else PRICE_WORLD`}),
    T({id:'j-q-log',
      text:'Напиши ‹safe_div(a, b)›: возвращает ‹a / b›. Если ‹b› равно нулю — пишет в логгер ‹"calc"› сообщение уровня WARNING (текст любой) и возвращает ‹None›. Проверка подцепит обработчик и посмотрит, что сообщение было.',
      starter:String.raw`
import logging

log = logging.getLogger("calc")

def safe_div(a, b):
    pass`,
      hint:'Если ‹b == 0›: ‹log.warning("деление на ноль")› и ‹return None›. Иначе ‹a / b›.',
      test:String.raw`
import logging
records = []
class Grab(logging.Handler):
    def emit(self, record):
        records.append(record)
h = Grab()
logging.getLogger("calc").addHandler(h)
logging.getLogger("calc").setLevel(logging.DEBUG)
assert safe_div(6, 3) == 2
assert records == [], "при нормальном делении логов быть не должно"
assert safe_div(1, 0) is None
assert len(records) == 1 and records[0].levelno == logging.WARNING, "нужно одно сообщение уровня WARNING"`,
      solution:String.raw`
import logging

log = logging.getLogger("calc")

def safe_div(a, b):
    if b == 0:
        log.warning("деление на ноль: %s / %s", a, b)
        return None
    return a / b`}),
    T({id:'j-q-typed', star:true,
      text:'Напиши ‹group_by(items, key)›: принимает список любых элементов и функцию ключа, возвращает словарь «ключ → список элементов». С аннотациями типов (‹list›, ‹Callable›, ‹dict›). Сохраняй порядок появления внутри групп.',
      starter:String.raw`
from typing import Callable

def group_by(items: list, key: Callable) -> dict:
    pass`,
      hint:'Пустой словарь, в цикле ‹result.setdefault(key(it), []).append(it)› или ‹defaultdict(list)›.',
      test:String.raw`
assert group_by(["кот", "лев", "слон", "тигр"], len) == {3: ["кот", "лев"], 4: ["слон", "тигр"]}
assert group_by([1, 2, 3, 4, 5, 6], lambda n: n % 3) == {1: [1, 4], 2: [2, 5], 0: [3, 6]}
assert group_by([], str) == {}
assert group_by.__annotations__["return"] is dict, "верни аннотацию -> dict"`,
      solution:String.raw`
from typing import Callable

def group_by(items: list, key: Callable) -> dict:
    result: dict = {}
    for it in items:
        result.setdefault(key(it), []).append(it)
    return result`}),
  ]
});

COURSE.add('junior', {
  id:'j-project', title:'Проект: менеджер задач', blurb:'Классы, dataclass, JSON и мини-«командная строка» в одном приложении.',
  lead:'Капстоун-проект уровня джуна: то, что можно положить в портфолио и показать на собеседовании.',
  blocks:[
    S('Что строим'),
    P(String.raw`Менеджер задач (todo) на классах. Данные — объекты ‹Task›, логика — класс ‹TaskList›, хранение — JSON, управление — простая командная строка. Всё то, чему ты научился на этом уровне, в одном месте. Строим по шагам, каждый шаг проверяется.`),
    HOW('Архитектура', [
      '‹Task› — dataclass: ‹id›, ‹title›, ‹priority› (1 высокий … 3 низкий), ‹done›, ‹tags›.',
      '‹TaskList› — хранит задачи и выдаёт новые ‹id›: ‹add›, ‹complete›, ‹remove›.',
      'Запросы: невыполненные задачи по приоритету, фильтр по тегу, статистика.',
      'Хранение: ‹to_json› / ‹from_json›. Данные переживают перезапуск программы.',
      'Интерфейс: функция ‹run(cmd, tasks)›, которая разбирает текстовые команды вроде ‹add Купить хлеб !1›.'
    ]),
    S('Шаг 1: задачи и список'),
    T({id:'j-proj-core',
      text:'Создай ‹Task› через ‹@dataclass› (поля ‹id›, ‹title›, ‹priority=2›, ‹done=False›, ‹tags›, у каждой задачи свой список). Класс ‹TaskList› с методами: ‹add(title, priority=2, tags=None)› (создаёт задачу с новым ‹id› 1, 2, 3…, возвращает её), ‹complete(task_id)› (помечает выполненной), ‹remove(task_id)› (удаляет). Для несуществующего ‹id› — ‹KeyError›.',
      starter:String.raw`
from dataclasses import dataclass, field

@dataclass
class Task:
    pass

class TaskList:
    pass`,
      hint:'В ‹TaskList.__init__› заведи ‹self.tasks = []› и ‹self._next_id = 1›. Для поиска сделай приватный метод ‹_get(task_id)›, который бросает ‹KeyError›, если не нашёл — переиспользуй в ‹complete› и ‹remove›.',
      test:String.raw`
tl = TaskList()
a = tl.add("Купить хлеб")
b = tl.add("Сдать курсовую", priority=1, tags=["учёба"])
assert (a.id, b.id) == (1, 2) and a.priority == 2 and b.priority == 1
assert a.done is False and a.tags == [] and b.tags == ["учёба"]
a.tags.append("x")
assert tl.add("третья").tags == [], "у каждой задачи должен быть свой список тегов"
tl.complete(1)
assert a.done is True
tl.remove(2)
assert [t.id for t in tl.tasks] == [1, 3]
assert tl.add("после удаления").id == 4, "id не должны переиспользоваться"
for bad in (lambda: tl.complete(99), lambda: tl.remove(99)):
    try:
        bad()
    except KeyError:
        pass
    else:
        raise AssertionError("для несуществующего id нужен KeyError")`,
      solution:String.raw`
from dataclasses import dataclass, field

@dataclass
class Task:
    id: int
    title: str
    priority: int = 2
    done: bool = False
    tags: list = field(default_factory=list)

class TaskList:
    def __init__(self):
        self.tasks = []
        self._next_id = 1

    def add(self, title, priority=2, tags=None):
        task = Task(self._next_id, title, priority, tags=list(tags or []))
        self._next_id += 1
        self.tasks.append(task)
        return task

    def _get(self, task_id):
        for t in self.tasks:
            if t.id == task_id:
                return t
        raise KeyError(task_id)

    def complete(self, task_id):
        self._get(task_id).done = True

    def remove(self, task_id):
        self.tasks.remove(self._get(task_id))`}),
    S('Шаг 2: запросы'),
    T({id:'j-proj-query',
      text:'Добавь в ‹TaskList› методы: ‹pending()› — невыполненные задачи, отсортированные по приоритету (1 раньше 3), а при равных — по ‹id›; ‹by_tag(tag)› — все задачи с этим тегом; ‹stats()› — словарь ‹{"total": …, "done": …, "pending": …, "percent": …}›, где ‹percent› — доля выполненных в процентах, округлённая до целого (для пустого списка 0). Код шага 1 уже здесь.',
      starter:String.raw`
from dataclasses import dataclass, field

@dataclass
class Task:
    id: int
    title: str
    priority: int = 2
    done: bool = False
    tags: list = field(default_factory=list)

class TaskList:
    def __init__(self):
        self.tasks = []
        self._next_id = 1

    def add(self, title, priority=2, tags=None):
        task = Task(self._next_id, title, priority, tags=list(tags or []))
        self._next_id += 1
        self.tasks.append(task)
        return task

    def complete(self, task_id):
        for t in self.tasks:
            if t.id == task_id:
                t.done = True
                return
        raise KeyError(task_id)

    # допиши pending, by_tag, stats`,
      hint:'‹pending›: ‹sorted((t for t in self.tasks if not t.done), key=lambda t: (t.priority, t.id))›. Ключ-кортеж сравнивается по первому элементу, потом по второму. Проценты: ‹round(done / total * 100)›.',
      test:String.raw`
tl = TaskList()
tl.add("c", 3, ["дом"])
tl.add("a", 1, ["учёба", "дом"])
tl.add("b", 2)
tl.add("d", 1)
assert [t.title for t in tl.pending()] == ["a", "d", "b", "c"], f"pending: {[t.title for t in tl.pending()]}"
tl.complete(2)
assert [t.title for t in tl.pending()] == ["d", "b", "c"]
assert [t.title for t in tl.by_tag("дом")] == ["c", "a"]
assert tl.by_tag("нет") == []
assert tl.stats() == {"total": 4, "done": 1, "pending": 3, "percent": 25}, f"stats: {tl.stats()}"
assert TaskList().stats() == {"total": 0, "done": 0, "pending": 0, "percent": 0}`,
      solution:String.raw`
from dataclasses import dataclass, field

@dataclass
class Task:
    id: int
    title: str
    priority: int = 2
    done: bool = False
    tags: list = field(default_factory=list)

class TaskList:
    def __init__(self):
        self.tasks = []
        self._next_id = 1

    def add(self, title, priority=2, tags=None):
        task = Task(self._next_id, title, priority, tags=list(tags or []))
        self._next_id += 1
        self.tasks.append(task)
        return task

    def complete(self, task_id):
        for t in self.tasks:
            if t.id == task_id:
                t.done = True
                return
        raise KeyError(task_id)

    def pending(self):
        return sorted((t for t in self.tasks if not t.done), key=lambda t: (t.priority, t.id))

    def by_tag(self, tag):
        return [t for t in self.tasks if tag in t.tags]

    def stats(self):
        total = len(self.tasks)
        done = sum(t.done for t in self.tasks)
        percent = round(done / total * 100) if total else 0
        return {"total": total, "done": done, "pending": total - done, "percent": percent}`}),
    S('Шаг 3: сохраняем в JSON'),
    T({id:'j-proj-json',
      text:'Добавь ‹to_json()› (возвращает JSON-строку со всем списком, включая счётчик ‹id›) и классовый метод ‹from_json(text)›, который восстанавливает ‹TaskList›. После загрузки новые задачи должны продолжать нумерацию, а не начинать с 1. Используй ‹dataclasses.asdict›.',
      starter:String.raw`
import json
from dataclasses import dataclass, field, asdict

@dataclass
class Task:
    id: int
    title: str
    priority: int = 2
    done: bool = False
    tags: list = field(default_factory=list)

class TaskList:
    def __init__(self):
        self.tasks = []
        self._next_id = 1

    def add(self, title, priority=2, tags=None):
        task = Task(self._next_id, title, priority, tags=list(tags or []))
        self._next_id += 1
        self.tasks.append(task)
        return task

    # допиши to_json и from_json`,
      hint:'В ‹to_json› собери словарь ‹{"next_id": self._next_id, "tasks": [asdict(t) for t in self.tasks]}› и сделай ‹json.dumps(..., ensure_ascii=False)›. В ‹from_json›: ‹Task(**d)› для каждого словаря, не забудь ‹_next_id›.',
      test:String.raw`
tl = TaskList()
tl.add("Купить хлеб", 1, ["дом"])
tl.add("Сдать курсовую")
tl.tasks[1].done = True
text = tl.to_json()
assert isinstance(text, str) and "Купить хлеб" in text, "русский текст должен остаться читаемым в JSON"
back = TaskList.from_json(text)
assert back.tasks == tl.tasks, f"после загрузки: {back.tasks}"
assert back.tasks[0].tags == ["дом"] and back.tasks[1].done is True
assert back.add("новая").id == 3, "нумерация должна продолжиться"
assert tl._next_id == 3, "исходный список не должен меняться"
assert TaskList.from_json(TaskList().to_json()).tasks == []`,
      solution:String.raw`
import json
from dataclasses import dataclass, field, asdict

@dataclass
class Task:
    id: int
    title: str
    priority: int = 2
    done: bool = False
    tags: list = field(default_factory=list)

class TaskList:
    def __init__(self):
        self.tasks = []
        self._next_id = 1

    def add(self, title, priority=2, tags=None):
        task = Task(self._next_id, title, priority, tags=list(tags or []))
        self._next_id += 1
        self.tasks.append(task)
        return task

    def to_json(self):
        data = {"next_id": self._next_id, "tasks": [asdict(t) for t in self.tasks]}
        return json.dumps(data, ensure_ascii=False)

    @classmethod
    def from_json(cls, text):
        data = json.loads(text)
        tl = cls()
        tl.tasks = [Task(**d) for d in data["tasks"]]
        tl._next_id = data["next_id"]
        return tl`}),
    S('Шаг 4: командная строка'),
    T({id:'j-proj-cli', star:true,
      text:'Напиши ‹run(line, tl)›: разбирает текстовую команду и возвращает строку-ответ. Поддержи: ‹add <название> [!приоритет] [#тег …]› → ответ ‹"Добавлено #<id>"›; ‹done <id>› → ‹"Готово #<id>"›; ‹rm <id>› → ‹"Удалено #<id>"›; ‹list› → невыполненные по строке на задачу вида ‹"#<id> [<приоритет>] <название>"›, склеенные ‹"\\n"›, а если их нет — ‹"Пусто"›. Неизвестная команда или неверный ‹id› → ‹"Ошибка: …"› (текст после двоеточия любой), без падения.',
      starter:String.raw`
class Task:
    def __init__(self, id, title, priority, tags):
        self.id, self.title, self.priority, self.tags, self.done = id, title, priority, tags, False

class TaskList:
    def __init__(self):
        self.tasks, self._next_id = [], 1
    def add(self, title, priority=2, tags=None):
        t = Task(self._next_id, title, priority, list(tags or []))
        self._next_id += 1
        self.tasks.append(t)
        return t
    def _get(self, task_id):
        for t in self.tasks:
            if t.id == task_id:
                return t
        raise KeyError(task_id)
    def complete(self, task_id):
        self._get(task_id).done = True
    def remove(self, task_id):
        self.tasks.remove(self._get(task_id))
    def pending(self):
        return sorted((t for t in self.tasks if not t.done), key=lambda t: (t.priority, t.id))

def run(line, tl):
    pass`,
      hint:'‹cmd, _, rest = line.strip().partition(" ")›. Для ‹add›: разбей ‹rest› на слова; слова с ‹!› — приоритет (‹int(w[1:])›), с ‹#› — теги, остальные склей в название. Оберни всё в ‹try / except (KeyError, ValueError)›.',
      test:String.raw`
tl = TaskList()
assert run("add Купить хлеб", tl) == "Добавлено #1"
assert run("add Сдать курсовую !1 #учёба #срочно", tl) == "Добавлено #2"
t = tl.tasks[1]
assert (t.title, t.priority, t.tags) == ("Сдать курсовую", 1, ["учёба", "срочно"]), (t.title, t.priority, t.tags)
assert run("list", tl) == "#2 [1] Сдать курсовую\n#1 [2] Купить хлеб", repr(run("list", tl))
assert run("done 2", tl) == "Готово #2"
assert run("list", tl) == "#1 [2] Купить хлеб"
assert run("rm 1", tl) == "Удалено #1"
assert run("list", tl) == "Пусто"
for bad in ["done 99", "rm abc", "fly away", "done", ""]:
    r = run(bad, tl)
    assert isinstance(r, str) and r.startswith("Ошибка:"), f"run({bad!r}) = {r!r}"`,
      solution:String.raw`
class Task:
    def __init__(self, id, title, priority, tags):
        self.id, self.title, self.priority, self.tags, self.done = id, title, priority, tags, False

class TaskList:
    def __init__(self):
        self.tasks, self._next_id = [], 1
    def add(self, title, priority=2, tags=None):
        t = Task(self._next_id, title, priority, list(tags or []))
        self._next_id += 1
        self.tasks.append(t)
        return t
    def _get(self, task_id):
        for t in self.tasks:
            if t.id == task_id:
                return t
        raise KeyError(task_id)
    def complete(self, task_id):
        self._get(task_id).done = True
    def remove(self, task_id):
        self.tasks.remove(self._get(task_id))
    def pending(self):
        return sorted((t for t in self.tasks if not t.done), key=lambda t: (t.priority, t.id))

def run(line, tl):
    cmd, _, rest = line.strip().partition(" ")
    try:
        if cmd == "add":
            title, priority, tags = [], 2, []
            for w in rest.split():
                if w.startswith("!"):
                    priority = int(w[1:])
                elif w.startswith("#"):
                    tags.append(w[1:])
                else:
                    title.append(w)
            if not title:
                return "Ошибка: нет названия"
            return f"Добавлено #{tl.add(' '.join(title), priority, tags).id}"
        if cmd == "done":
            tl.complete(int(rest))
            return f"Готово #{int(rest)}"
        if cmd == "rm":
            tl.remove(int(rest))
            return f"Удалено #{int(rest)}"
        if cmd == "list":
            items = tl.pending()
            if not items:
                return "Пусто"
            return "\n".join(f"#{t.id} [{t.priority}] {t.title}" for t in items)
        return f"Ошибка: неизвестная команда {cmd!r}"
    except (KeyError, ValueError):
        return "Ошибка: неверный номер или формат"`}),
    S('Как довести проект до портфолио'),
    L([
      '**Git.** ‹git init›, коммиты по смыслу («добавил экспорт в JSON»), а не «правки». Потом репозиторий на GitHub.',
      '**README.** Что это, как запустить, пример команд, скриншот. Это первое, что откроет работодатель.',
      '**Окружение.** ‹python -m venv .venv›, зависимости в ‹requirements.txt› (‹pip freeze›). Без него никто не повторит твою установку.',
      '**Тесты.** Положи свои ‹assert›-проверки из заданий в файл ‹test_tasks.py› и запускай ‹pytest›.',
      '**Секреты.** Токены и пароли — только в ‹.env›, который в ‹.gitignore›. Никогда не коммить ключи.',
    ]),
    Q(String.raw`Что должно лежать в ‹.gitignore› любого проекта?`, ['Исходный код', 'README.md', '.env с токенами и папка .venv', 'requirements.txt'], 2, String.raw`Секреты и виртуальное окружение в репозиторий не кладут: секреты — из соображений безопасности, окружение — потому что его можно пересоздать из ‹requirements.txt›.`),
    P(String.raw`**Что дальше?** Выбери направление и сделай по нему проект на 1–2 недели: Telegram-бот на ‹aiogram›, API на ‹FastAPI› с базой данных, парсер на ‹requests› и ‹BeautifulSoup›, анализ данных в ‹pandas›. Один законченный проект в портфолио весит больше десяти пройденных курсов.`),
  ]
});
