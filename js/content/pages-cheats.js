/* страница «Шпаргалка» */
COURSE.pages.cheats = {
  title:'Шпаргалка по Python',
  lead:'Синтаксис и методы на одной странице. Не заменяет уроки, а нужна, чтобы быстро вспомнить, как это пишется. Ищи по странице через ⟦Ctrl⟧+⟦F⟧.',
  blocks:[
    S('Типы и преобразования'),
    TB(['Тип', 'Пример', 'Превратить'], [
      ['‹int› целое', '‹42›, ‹-7›', '‹int("42")›, ‹int(3.9)› → 3'],
      ['‹float› дробное', '‹3.14›, ‹2.0›', '‹float("2.5")›'],
      ['‹str› строка', '‹"текст"›, ‹\'a\'›', '‹str(42)› → "42"'],
      ['‹bool› да/нет', '‹True›, ‹False›', '‹bool(0)› → False, ‹bool("a")› → True'],
      ['‹list› список', '‹[1, 2, 3]›', '‹list("abc")›, ‹list(range(3))›'],
      ['‹tuple› кортеж', '‹(1, 2)›', '‹tuple([1, 2])›'],
      ['‹set› множество', '‹{1, 2, 3}›', '‹set([1, 1, 2])›'],
      ['‹dict› словарь', '‹{"a": 1}›', '‹dict(a=1)›, ‹dict(zip(k, v))›'],
      ['‹None›', 'ничего', 'результат функции без ‹return›'],
    ]),
    S('Операторы'),
    TB(['Что', 'Операторы'], [
      ['арифметика', '‹+›  ‹-›  ‹*›  ‹/› (всегда дробь)  ‹//› (целая часть)  ‹%› (остаток)  ‹**› (степень)'],
      ['сравнение', '‹==›  ‹!=›  ‹<›  ‹>›  ‹<=›  ‹>=›   цепочка: ‹1 < x < 10›'],
      ['логика', '‹and›  ‹or›  ‹not›'],
      ['принадлежность', '‹x in a›  ‹x not in a›'],
      ['тождество', '‹x is None›  ‹x is not None›'],
      ['присваивание', '‹=›  ‹+=›  ‹-=›  ‹*=›  ‹/=›  ‹//=›  ‹%=›'],
      ['ложные значения', '‹0›, ‹0.0›, ‹""›, ‹[]›, ‹{}›, ‹set()›, ‹None›, ‹False›'],
    ]),
    S('Строки'),
    TB(['Что нужно', 'Как'], [
      ['длина', '‹len(s)›'],
      ['срез', '‹s[0]›  ‹s[-1]›  ‹s[1:4]›  ‹s[:3]›  ‹s[::-1]› (задом наперёд)'],
      ['регистр', '‹s.upper()›  ‹s.lower()›  ‹s.capitalize()›  ‹s.title()›'],
      ['очистка', '‹s.strip()›  ‹s.lstrip()›  ‹s.rstrip()›'],
      ['поиск', '‹s.find("x")› (или -1)  ‹s.count("x")›  ‹"x" in s›'],
      ['проверки', '‹s.startswith("a")›  ‹s.endswith(".py")›  ‹s.isdigit()›  ‹s.isalpha()›'],
      ['замена', '‹s.replace("старое", "новое")›'],
      ['разрезать и склеить', '‹s.split(",")›  ‹" ".join(список)›'],
      ['f-строка', '‹f"{name} {x:.2f} {n:>5} {big:,}"›'],
      ['повторить', '‹"ab" * 3›'],
      ['спецсимволы', '‹\\n› перенос  ‹\\t› табуляция  ‹\\"› кавычка'],
    ]),
    S('Списки'),
    TB(['Что нужно', 'Как'], [
      ['создать', '‹a = [1, 2, 3]›  ‹a = []›  ‹a = [0] * 5›'],
      ['взять', '‹a[0]›  ‹a[-1]›  ‹a[1:3]›  ‹a[::2]›'],
      ['добавить', '‹a.append(x)› в конец  ‹a.insert(i, x)› на место  ‹a.extend(b)› списком'],
      ['убрать', '‹a.remove(x)› по значению  ‹a.pop()› последний  ‹a.pop(i)›  ‹del a[i]›'],
      ['поменять', '‹a[i] = x›'],
      ['сортировать', '‹a.sort()› на месте  ‹sorted(a)› копия  ‹reverse=True›  ‹key=len›'],
      ['развернуть', '‹a.reverse()›  ‹a[::-1]›'],
      ['посчитать', '‹len(a)›  ‹sum(a)›  ‹min(a)›  ‹max(a)›  ‹a.count(x)›  ‹a.index(x)›'],
      ['копия', '‹a.copy()›  ‹a[:]›  (а ‹b = a› — та же коробка!)'],
      ['перебор', '‹for x in a:›  ‹for i, x in enumerate(a):›  ‹for x, y in zip(a, b):›'],
      ['comprehension', '‹[x * 2 for x in a if x > 0]›'],
    ]),
    S('Словари и множества'),
    TB(['Что нужно', 'Как'], [
      ['создать словарь', '‹d = {"a": 1, "b": 2}›  ‹d = {}›'],
      ['взять', '‹d["a"]› (KeyError, если нет)  ‹d.get("a", 0)› безопасно'],
      ['записать', '‹d["c"] = 3›  ‹d.update(другой)›'],
      ['удалить', '‹del d["a"]›  ‹d.pop("a")›'],
      ['есть ли ключ', '‹"a" in d›'],
      ['перебор', '‹for k in d:›  ‹for v in d.values():›  ‹for k, v in d.items():›'],
      ['счётчик', '‹d[x] = d.get(x, 0) + 1›  или ‹Counter(a)›'],
      ['множество', '‹s = {1, 2}›  ‹s = set()›  ‹s.add(x)›  ‹s.discard(x)›'],
      ['операции', '‹a | b› объединение  ‹a & b› общее  ‹a - b› разность  ‹a ^ b› только в одном'],
    ]),
    S('Условия и циклы'),
    K(String.raw`
if x > 10:
    ...
elif x > 5:
    ...
else:
    ...

status = "ok" if x > 0 else "bad"     # в одну строку

for i in range(5):                    # 0..4
    ...
for i in range(1, 10, 2):             # 1, 3, 5, 7, 9
    ...
while условие:
    ...
    break      # выйти из цикла
    continue   # к следующему кругу

for x in a:
    ...
else:          # выполнится, если не было break
    ...`, {lang:'python', title:'условия и циклы'}),
    S('Функции'),
    K(String.raw`
def name(a, b=2, *args, **kwargs):
    """Описание функции."""
    return a + b

name(1)                 # 3
name(1, b=5)            # по имени
f = lambda x: x * 2     # короткая функция

def f(items=None):      # изменяемое — только через None
    if items is None:
        items = []`, {lang:'python', title:'функции'}),
    S('Ошибки'),
    K(String.raw`
try:
    x = int(text)
except ValueError:
    x = 0
except (KeyError, IndexError) as e:
    print("ошибка:", e)
else:
    print("без ошибок")
finally:
    print("выполнится всегда")

raise ValueError("плохое значение")   # бросить свою ошибку
assert x > 0, "x должен быть положительным"`, {lang:'python', title:'try / except'}),
    TB(['Ошибка', 'Когда'], [
      ['‹SyntaxError›', 'опечатка в самом коде: забыл скобку, двоеточие, кавычку'],
      ['‹NameError›', 'переменная не существует (опечатка или не создана)'],
      ['‹TypeError›', 'не тот тип: ‹"5" + 5›, вызов функции с неправильным числом аргументов'],
      ['‹ValueError›', 'тип верный, значение нет: ‹int("abc")›'],
      ['‹IndexError›', 'индекс за границей списка'],
      ['‹KeyError›', 'нет такого ключа в словаре'],
      ['‹AttributeError›', 'у объекта нет такого поля или метода'],
      ['‹ZeroDivisionError›', 'деление на ноль'],
      ['‹IndentationError›', 'неправильный отступ'],
      ['‹ModuleNotFoundError›', 'библиотека не установлена: ‹pip install …›'],
    ]),
    S('Файлы, JSON, даты'),
    K(String.raw`
with open("a.txt", "w", encoding="utf-8") as f:   # w — писать, a — дописать, r — читать
    f.write("строка\n")
with open("a.txt", encoding="utf-8") as f:
    text = f.read()          # весь текст
    # for line in f: ...     # или по строкам

import json
json.dumps(data, ensure_ascii=False)    # объект -> текст
json.loads(text)                        # текст -> объект
json.dump(data, f, ensure_ascii=False)  # в файл
json.load(f)                            # из файла

from datetime import date, datetime, timedelta
d = datetime.strptime("24.12.2026", "%d.%m.%Y")   # строка -> дата
d.strftime("%Y-%m-%d")                             # дата -> строка
(date(2026, 12, 31) - date.today()).days           # дней до даты
d + timedelta(days=7)                              # плюс неделя`, {lang:'python', title:'файлы и данные'}),
    S('Классы'),
    K(String.raw`
class Dog(Animal):                    # наследуется от Animal
    count = 0                         # общее для всех

    def __init__(self, name):
        super().__init__(name)
        self.name = name              # поле объекта

    def __str__(self):                # как показывать в print
        return f"Dog({self.name})"

    @property
    def upper(self):                  # доступ как к полю: d.upper
        return self.name.upper()

    @classmethod
    def from_str(cls, s):             # альтернативный конструктор
        return cls(s.strip())

    @staticmethod
    def helper(x):                    # обычная функция внутри класса
        return x * 2

from dataclasses import dataclass, field
@dataclass
class Item:
    title: str
    tags: list = field(default_factory=list)`, {lang:'python', title:'классы'}),
    S('Полезные встроенные функции и модули'),
    TB(['Что нужно', 'Как'], [
      ['сумма, минимум, максимум', '‹sum()›  ‹min()›  ‹max()›'],
      ['округлить, модуль числа', '‹round(x, 2)›  ‹abs(x)›'],
      ['все / хоть один', '‹all(условия)›  ‹any(условия)›'],
      ['номера и пары', '‹enumerate(a, start=1)›  ‹zip(a, b)›'],
      ['отсортировать по ключу', '‹sorted(a, key=lambda x: x[1], reverse=True)›'],
      ['тип, проверка типа', '‹type(x)›  ‹isinstance(x, int)›'],
      ['случайное', '‹import random›  ‹random.randint(1, 6)›  ‹random.choice(a)›  ‹random.shuffle(a)›'],
      ['математика', '‹import math›  ‹math.sqrt()›  ‹math.ceil()›  ‹math.floor()›  ‹math.pi›'],
      ['счётчики и группы', '‹from collections import Counter, defaultdict, deque›'],
      ['регулярки', '‹import re›  ‹re.findall(r"\\d+", s)›  ‹re.sub(r"\\s+", " ", s)›'],
      ['время работы', '‹import time›  ‹time.perf_counter()›'],
    ]),
    S('Частые приёмы'),
    K(String.raw`
a, b = b, a                              # поменять местами
first, *rest = [1, 2, 3, 4]              # распаковка
nums = [int(x) for x in input().split()] # числа из одной строки ввода
total = sum(x * x for x in range(10))    # сумма без списка
words = text.lower().split()             # слова в нижнем регистре
top = Counter(words).most_common(3)      # три самых частых
flat = [x for row in matrix for x in row]   # развернуть список списков
if __name__ == "__main__":               # код, который запускается только как программа
    main()`, {lang:'python', title:'приёмы'}),
    P(String.raw`Не нашёл нужного? Поищи в [словаре](#/glossary) или нажми ⟦Ctrl⟧+⟦K⟧.`),
  ]
};
