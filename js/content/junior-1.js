/* Джун, часть 1: питоничный код, функции глубже, классы и ООП */

COURSE.add('junior', {
  id:'j-pythonic', title:'Пишем по-питоновски', blurb:'enumerate, zip, распаковка, comprehension и правда/ложь.',
  lead:'Код, который и работает, и читается как надо. Приёмы, по которым сразу видно опытного человека.',
  blocks:[
    S('enumerate и zip'),
    P(String.raw`Начинающие пишут ‹for i in range(len(items))›. Опытные — ‹enumerate›. Он выдаёт пары «номер, элемент». А ‹zip› проходит по нескольким спискам одновременно.`),
    C(String.raw`
names = ["Аня", "Борис", "Вика"]
scores = [91, 64, 78]

for i, name in enumerate(names, start=1):
    print(i, name)

for name, score in zip(names, scores):
    print(f"{name}: {score}")

print(dict(zip(names, scores)))     # быстро собрать словарь`),
    E({say:String.raw`‹zip› — застёжка-молния: два ряда зубчиков (два списка) сцепляются парами. Первый зубец с первым, второй со вторым. Если один ряд короче, молния заканчивается там, где кончился короткий. ‹enumerate› — просто нумеруешь вагоны по ходу движения, не считая их отдельно.`,
      title:'Те же приёмы на других данных',
      code:String.raw`
cities = ["Берлин", "Париж", "Рим", "Вена"]
temps = [4, 8, 12]            # короче!
for c, t in zip(cities, temps):
    print(c, t)               # Вена не попадёт
print(list(enumerate("abc")))`}),
    S('Распаковка'),
    P(String.raw`Распаковывать можно что угодно итерируемое. Звёздочка собирает «всё остальное».`),
    C(String.raw`
first, *middle, last = [10, 20, 30, 40, 50]
print(first, middle, last)

head, *tail = "Python"
print(head, tail)

a, b = 1, 2
a, b = b, a             # swap без третьей переменной
print(a, b)

for k, (x, y) in {"p": (1, 2)}.items():
    print(k, x, y)      # распаковка вложенных пар`),
    S('Comprehension: списки, словари, множества'),
    P(String.raw`Одна и та же идея «преобразуй и отфильтруй» работает для всех коллекций. Ради читаемости не вкладывай больше двух уровней.`),
    C(String.raw`
words = ["python", "go", "rust", "c", "java"]

lens = [len(w) for w in words]                      # список
d = {w: len(w) for w in words}                      # словарь
first_letters = {w[0] for w in words}               # множество
long_ones = [w.upper() for w in words if len(w) > 3]

print(lens)
print(d)
print(first_letters)
print(long_ones)

pairs = [(x, y) for x in range(3) for y in range(3) if x < y]   # два цикла в одном
print(pairs)`),
    W(String.raw`Если comprehension не влезает в одну строку или в нём есть побочные действия (‹print›, запись в файл) — пиши обычный цикл. Читаемость важнее краткости.`),
    S('Правда и ложь'),
    P(String.raw`В условиях не надо сравнивать с ‹True› и длину с нулём. «Ложными» считаются ‹0›, ‹0.0›, ‹""›, ‹[]›, ‹{}›, ‹set()›, ‹None› и ‹False›. Всё остальное — «правда». А ‹any()› и ‹all()› проверяют «хоть один» и «все».`),
    C(String.raw`
items = []
if not items:                 # вместо if len(items) == 0
    print("пусто")

nums = [3, 8, 12]
print(any(n > 10 for n in nums))     # хоть один больше 10?
print(all(n > 0 for n in nums))      # все положительные?

name = ""
shown = name or "Аноним"      # or возвращает первое «правдивое»
print(shown)`),
    S('Ещё несколько приёмов'),
    C(String.raw`
# условное выражение
age = 20
kind = "взрослый" if age >= 18 else "ребёнок"

# проверка принадлежности вместо цепочки or
if kind in ("взрослый", "пенсионер"):
    print("билет полный")

# тернарный + f-строка с выражением и форматом
price = 1234.5
print(f"Цена: {price:,.2f} €".replace(",", " "))

# sorted по ключу
people = [("Аня", 25), ("Борис", 19), ("Вика", 31)]
print(sorted(people, key=lambda p: p[1]))
print(max(people, key=lambda p: p[1]))`),
    Q(String.raw`Что выведет ‹list(zip("ab", [1, 2, 3]))›?`, ['[("a", 1), ("b", 2), ("c", 3)]', '[("a", 1), ("b", 2)]', 'Ошибку: разная длина', '[("a", 1)]'], 1, String.raw`‹zip› останавливается на самом коротком итерируемом: у строки «ab» две буквы, значит, получится две пары.`),

    T({id:'j-py-pairs',
      text:'Есть два списка одинаковой длины: ‹names› и ‹ages›. Собери в ‹people› список строк вида ‹"Аня (25)"›, по одной на человека, в том же порядке.',
      starter:String.raw`
names = ["Аня", "Борис", "Вика"]
ages = [25, 19, 31]
people = []`,
      hint:'‹[f"{n} ({a})" for n, a in zip(names, ages)]›.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith(("names =", "ages =")))
g = {"names": ["Ли", "Ян"], "ages": [7, 9]}; exec(body, g)
assert g["people"] == ["Ли (7)", "Ян (9)"], f"получилось: {g['people']}"`,
      solution:String.raw`
names = ["Аня", "Борис", "Вика"]
ages = [25, 19, 31]
people = [f"{n} ({a})" for n, a in zip(names, ages)]`}),
    T({id:'j-py-lens',
      text:'Для списка слов ‹words› собери словарь ‹lens›: слово → его длина, но только для слов длиннее 2 букв.',
      starter:String.raw`
words = ["a", "to", "cat", "house", "go"]
lens = {}`,
      hint:'Словарное comprehension с условием: ‹{w: len(w) for w in words if len(w) > 2}›.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("words ="))
g = {"words": ["ab", "abc", "xyzw"]}; exec(body, g)
assert g["lens"] == {"abc": 3, "xyzw": 4}, f"получилось: {g['lens']}"`,
      solution:String.raw`
words = ["a", "to", "cat", "house", "go"]
lens = {w: len(w) for w in words if len(w) > 2}`}),
    T({id:'j-py-flatten',
      text:'Дан список списков ‹matrix›. Разверни его в один плоский список ‹flat› одним comprehension (два ‹for› подряд).',
      starter:String.raw`
matrix = [[1, 2], [3], [4, 5, 6]]
flat = []`,
      hint:'‹[x for row in matrix for x in row]› — читается как два вложенных цикла, внешний первый.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("matrix ="))
g = {"matrix": [["a"], [], ["b", "c"]]}; exec(body, g)
assert g["flat"] == ["a", "b", "c"], f"получилось: {g['flat']}"`,
      solution:String.raw`
matrix = [[1, 2], [3], [4, 5, 6]]
flat = [x for row in matrix for x in row]`}),
    T({id:'j-py-best',
      text:'В ‹players› список кортежей ‹(имя, очки)›. Запиши в ‹top› **имена** трёх лучших игроков по очкам (от большего к меньшему). Используй ‹sorted› с ‹key›.',
      starter:String.raw`
players = [("Аня", 70), ("Борис", 95), ("Вика", 88), ("Гена", 60), ("Даша", 91)]
top = []`,
      hint:'‹sorted(players, key=lambda p: p[1], reverse=True)[:3]›, а из получившихся пар возьми имена.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("players ="))
g = {"players": [("a", 1), ("b", 5), ("c", 3), ("d", 4)]}; exec(body, g)
assert g["top"] == ["b", "d", "c"], f"получилось: {g['top']}"`,
      solution:String.raw`
players = [("Аня", 70), ("Борис", 95), ("Вика", 88), ("Гена", 60), ("Даша", 91)]
top = [name for name, score in sorted(players, key=lambda p: p[1], reverse=True)[:3]]`}),
    T({id:'j-py-allany', star:true,
      text:'Напиши ‹check_password(pw)›: возвращает ‹True›, если пароль не короче 8 символов, содержит хотя бы одну цифру **и** хотя бы одну заглавную букву. Используй ‹any› и ‹str.isdigit()› / ‹str.isupper()›.',
      starter:String.raw`
def check_password(pw):
    pass`,
      hint:'‹len(pw) >= 8 and any(c.isdigit() for c in pw) and any(c.isupper() for c in pw)›.',
      test:String.raw`
cases = [("Abcdefg1", True), ("abcdefg1", False), ("ABCDEFGH", False), ("Ab1", False), ("", False), ("Password123", True)]
for pw, want in cases:
    assert check_password(pw) is want, f"check_password({pw!r}) должна вернуть {want}"`,
      solution:String.raw`
def check_password(pw):
    return len(pw) >= 8 and any(c.isdigit() for c in pw) and any(c.isupper() for c in pw)`}),
  ]
});

COURSE.add('junior', {
  id:'j-funcs', title:'Функции глубже', blurb:'*args, **kwargs, lambda, замыкания и ловушка с изменяемыми аргументами.',
  lead:'Функции — это такие же значения, как числа: их можно передавать, возвращать и хранить в списках.',
  blocks:[
    S('Переменное число аргументов'),
    P(String.raw`‹*args› собирает все «лишние» позиционные аргументы в кортеж, ‹**kwargs› — все именованные в словарь. Это основа большинства библиотечных функций.`),
    C(String.raw`
def total(*nums):
    return sum(nums)

print(total(1, 2, 3))
print(total())

def profile(name, **extra):
    print(name, extra)

profile("Коля", age=20, city="Берлин")

def call(f, *args, **kwargs):
    return f(*args, **kwargs)       # звёздочки при вызове раскрывают обратно

print(call(max, 3, 9, 4))
print(call(print, 1, 2, sep="-"))`),
    E({say:String.raw`Ты заказываешь пиццу. Обязательное — размер. Но можно добавить любые начинки: ‹*args› — «сколько хочешь начинок через запятую» (кладутся в коробочку-кортеж), ‹**kwargs› — «любые пожелания с названиями»: «сыр=двойной, соус=острый» (кладутся в словарь). Звёздочки при вызове делают обратное: открывают коробочку и раскладывают.`,
      title:'Другая функция со звёздочками',
      code:String.raw`
def order(size, *toppings, **notes):
    print("Размер:", size)
    print("Начинки:", toppings)
    print("Пожелания:", notes)

order("L", "сыр", "грибы", sauce="острый", cut=8)

args = ["M", "ветчина"]
order(*args)             # раскладываем список в аргументы`}),
    S('Функции — тоже значения'),
    P(String.raw`Функцию можно положить в переменную, список или словарь и передать другой функции. ‹lambda› — короткая безымянная функция, обычно для ключей сортировки.`),
    C(String.raw`
def double(x): return x * 2
def square(x): return x ** 2

ops = {"x2": double, "sq": square}
for name, f in ops.items():
    print(name, f(7))

words = ["банан", "яблоко", "киви", "груша"]
print(sorted(words, key=len))                      # по длине
print(sorted(words, key=lambda w: w[-1]))          # по последней букве
print(list(map(lambda w: w.upper(), words)))
print(list(filter(lambda w: len(w) > 4, words)))`),
    N(String.raw`Для ‹map› и ‹filter› чаще пишут comprehension: ‹[w.upper() for w in words]› читается лучше. А вот ‹key=lambda …› для ‹sorted›, ‹min›, ‹max› — норма.`),
    S('Область видимости'),
    P(String.raw`Переменная внутри функции локальная. Python ищет имя по цепочке: локальные → объемлющая функция → глобальные → встроенные (правило LEGB). Менять глобальные из функции — плохая идея; лучше принимать параметры и возвращать результат.`),
    C(String.raw`
x = "глобальная"

def show():
    x = "локальная"      # новая переменная, глобальную не трогаем
    print(x)

show()
print(x)

counter = 0
def bad():
    global counter       # допустимо, но лучше избегать
    counter += 1
bad(); bad()
print(counter)`),
    S('Замыкания'),
    P(String.raw`Функция, созданная внутри другой, «помнит» её переменные даже после того, как внешняя функция закончилась. Это называется замыканием.`),
    C(String.raw`
def make_counter():
    count = 0
    def inc():
        nonlocal count      # меняем переменную внешней функции
        count += 1
        return count
    return inc

a = make_counter()
b = make_counter()
print(a(), a(), a())    # 1 2 3
print(b())              # 1: у каждого своя копия`),
    HOW('Почему счётчик не сбрасывается', [
      'Вызов ‹make_counter()› создаёт переменную ‹count = 0› и внутреннюю функцию ‹inc›.',
      'Внешняя функция заканчивается и возвращает ‹inc›. Обычно её переменные удаляются...',
      '...но ‹inc› ссылается на ‹count›, поэтому Python сохраняет эту переменную вместе с функцией (это и есть «замыкание»).',
      'Каждый новый вызов ‹make_counter()› создаёт **свой** ‹count› и свою ‹inc›: поэтому ‹a› и ‹b› независимы.',
    ]),
    S('Ловушка: изменяемое значение по умолчанию'),
    C(String.raw`
def add_bad(x, bucket=[]):      # список создаётся ОДИН раз, при определении функции
    bucket.append(x)
    return bucket

print(add_bad(1))
print(add_bad(2))               # сюрприз: [1, 2]

def add_good(x, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(x)
    return bucket

print(add_good(1))
print(add_good(2))`),
    W(String.raw`Никогда не используй ‹[]›, ‹{}›, ‹set()› как значение параметра по умолчанию. Ставь ‹None› и создавай внутри функции. На собеседованиях про это спрашивают почти всегда.`),
    Q(String.raw`Что вернёт ‹sorted(["bb", "a", "ccc"], key=len, reverse=True)›?`, ['["a", "bb", "ccc"]', '["ccc", "bb", "a"]', '["bb", "a", "ccc"]', '["a", "ccc", "bb"]'], 1, String.raw`Сортируем по длине (‹key=len›), а ‹reverse=True› разворачивает порядок: сначала самые длинные.`),

    T({id:'j-fn-mean',
      text:'Напиши ‹mean(*nums)›: среднее арифметическое любого числа аргументов. Если аргументов нет — верни ‹0›.',
      starter:String.raw`
def mean(*nums):
    pass`,
      hint:'Проверь ‹if not nums: return 0›, иначе ‹sum(nums) / len(nums)›.',
      test:String.raw`
assert mean(1, 2, 3) == 2
assert mean(10) == 10
assert mean() == 0
assert mean(1, 2) == 1.5`,
      solution:String.raw`
def mean(*nums):
    if not nums:
        return 0
    return sum(nums) / len(nums)`}),
    T({id:'j-fn-sortby',
      text:'Напиши ‹sort_users(users, field)›: возвращает новый список словарей, отсортированный по значению поля ‹field›. Исходный список менять нельзя.',
      starter:String.raw`
def sort_users(users, field):
    pass`,
      hint:'‹sorted(users, key=lambda u: u[field])› сразу возвращает новый список.',
      test:String.raw`
users = [{"name": "Борис", "age": 30}, {"name": "Аня", "age": 25}, {"name": "Вика", "age": 41}]
by_age = sort_users(users, "age")
assert [u["name"] for u in by_age] == ["Аня", "Борис", "Вика"], f"по возрасту получилось: {by_age}"
by_name = sort_users(users, "name")
assert [u["name"] for u in by_name] == ["Аня", "Борис", "Вика"]
assert users[0]["name"] == "Борис", "исходный список менять нельзя"`,
      solution:String.raw`
def sort_users(users, field):
    return sorted(users, key=lambda u: u[field])`}),
    T({id:'j-fn-multiplier',
      text:'Напиши ‹make_multiplier(k)›: возвращает функцию, которая умножает своё число на ‹k›. Так: ‹triple = make_multiplier(3)›, ‹triple(5)› → 15.',
      starter:String.raw`
def make_multiplier(k):
    pass`,
      hint:'Верни внутреннюю функцию: ‹def mul(x): return x * k›, затем ‹return mul›. Или просто ‹return lambda x: x * k›.',
      test:String.raw`
double = make_multiplier(2)
triple = make_multiplier(3)
assert double(5) == 10, f"double(5) = {double(5)}"
assert triple(5) == 15, f"triple(5) = {triple(5)}"
assert double(7) == 14, "double должна остаться двойкой, даже после создания triple"`,
      solution:String.raw`
def make_multiplier(k):
    def mul(x):
        return x * k
    return mul`}),
    T({id:'j-fn-collect',
      text:'Напиши ‹collect(item, bucket=None)›: добавляет ‹item› в список ‹bucket› и возвращает его. Если ‹bucket› не передан — каждый раз создаётся **новый** пустой список (не тот самый общий!).',
      starter:String.raw`
def collect(item, bucket=None):
    pass`,
      hint:'Внутри: ‹if bucket is None: bucket = []›, потом ‹bucket.append(item)› и ‹return bucket›.',
      test:String.raw`
assert collect(1) == [1]
assert collect(2) == [2], "второй вызов без списка должен вернуть новый список [2]"
mine = []
collect("a", mine); collect("b", mine)
assert mine == ["a", "b"], "переданный список должен пополняться"`,
      solution:String.raw`
def collect(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket`}),
    T({id:'j-fn-compose', star:true,
      text:'Напиши ‹compose(*funcs)›: принимает несколько функций и возвращает одну, которая применяет их **слева направо** к значению. ‹compose(f, g)(x)› = ‹g(f(x))›.',
      starter:String.raw`
def compose(*funcs):
    pass`,
      hint:'Верни внутреннюю функцию ‹run(x)›: в цикле по ‹funcs› делай ‹x = f(x)›, в конце ‹return x›.',
      test:String.raw`
inc = lambda x: x + 1
dbl = lambda x: x * 2
assert compose(inc, dbl)(5) == 12, "сначала +1 → 6, потом ×2 → 12"
assert compose(dbl, inc)(5) == 11, "сначала ×2 → 10, потом +1 → 11"
assert compose()(7) == 7, "без функций — число не меняется"
assert compose(str.strip, str.upper)("  hi ") == "HI"`,
      solution:String.raw`
def compose(*funcs):
    def run(x):
        for f in funcs:
            x = f(x)
        return x
    return run`}),
  ]
});

COURSE.add('junior', {
  id:'j-oop1', title:'Классы и объекты', blurb:'class, __init__, self, методы и красивый вывод через __str__.',
  lead:'Собираем данные и действия над ними в один объект. Основа для почти всех больших программ.',
  blocks:[
    S('Зачем нужны классы'),
    P(String.raw`Раньше мы хранили пользователя в словаре, а функции для него лежали отдельно. Класс склеивает данные и действия в одно целое: у объекта есть **поля** (что он знает) и **методы** (что он умеет).`),
    C(String.raw`
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name}: гав!"

    def birthday(self):
        self.age += 1

rex = Dog("Рекс", 3)
rex.birthday()
print(rex.name, rex.age)
print(rex.bark())

luna = Dog("Луна", 1)      # второй объект, независимый
print(luna.bark())`),
    E({say:[
        String.raw`Класс — **чертёж** дома. Объект — **дом**, построенный по чертежу. По одному чертежу можно построить много домов, и у каждого свои жильцы и цвет стен.`,
        String.raw`‹__init__› — это «заселение»: когда дом построен, туда въезжают первые данные. ‹self› — это «сам этот дом»: слово, с помощью которого дом говорит о себе: «моё имя», «мой возраст».`],
      title:'Другой чертёж: банковский счёт',
      code:String.raw`
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

a = Account("Аня", 100)
b = Account("Борис")
a.deposit(50)
print(a.owner, a.balance)
print(b.owner, b.balance)     # у Бориса своя копейка отдельно`}),
    HOW('Что происходит при Dog("Рекс", 3)', [
      'Python создаёт пустой объект типа ‹Dog›.',
      'Автоматически вызывается ‹__init__›, и этот новый объект подставляется вместо ‹self›.',
      '‹self.name = name› кладёт в объект поле ‹name›. То же с ‹age›.',
      'Готовый объект возвращается и кладётся в переменную ‹rex›.',
      'Вызов ‹rex.birthday()› — это то же самое, что ‹Dog.birthday(rex)›: объект слева от точки становится ‹self›.'
    ]),
    W(String.raw`Забытый ‹self› первым параметром метода — самая частая ошибка: ‹def bark():› даст ‹TypeError: takes 0 positional arguments but 1 was given›. А забытый ‹self.› перед полем внутри метода создаст не поле, а обычную локальную переменную, которая исчезнет.`),

    S('__str__ и __repr__'),
    P(String.raw`Если вывести объект как есть, увидишь скучное ‹<__main__.Dog object at 0x…>›. Метод ‹__str__› говорит, как показывать объект людям (для ‹print›), а ‹__repr__› — как показывать программистам (для отладки; в идеале выглядит как код создания).`),
    C(String.raw`
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __str__(self):
        return f"({self.x}; {self.y})"

p = Point(3, 4)
print(p)           # __str__
print([p, p])      # внутри списка используется __repr__
print(repr(p))`),
    S('Магические методы'),
    P(String.raw`Методы с двойным подчёркиванием («дандеры») позволяют объектам вести себя как встроенные типы. Через них работают ‹+›, ‹==›, ‹len()›, ‹in›, ‹<›.`),
    C(String.raw`
class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vec(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __len__(self):
        return 2

    def __repr__(self):
        return f"Vec({self.x}, {self.y})"

v = Vec(1, 2) + Vec(10, 20)
print(v, v == Vec(11, 22), len(v))`),
    TB(['Метод', 'Что включает'], [
      ['‹__init__›', 'создание объекта'],
      ['‹__str__›, ‹__repr__›', '‹print(x)›, отладочный вид'],
      ['‹__eq__›, ‹__lt__›', '‹==›, ‹<› (и сортировка)'],
      ['‹__add__›, ‹__mul__›', '‹+›, ‹*›'],
      ['‹__len__›, ‹__getitem__›, ‹__contains__›', '‹len(x)›, ‹x[i]›, ‹a in x›'],
    ]),
    S('Поля класса и поля объекта'),
    P(String.raw`Поле, объявленное прямо в теле класса, общее для всех объектов; поле через ‹self› — своё у каждого. Общие поля удобны для констант и счётчиков.`),
    C(String.raw`
class Player:
    count = 0               # общее для всех
    def __init__(self, nick):
        self.nick = nick    # у каждого своё
        self.hp = 100
        Player.count += 1

a = Player("a")
b = Player("b")
b.hp -= 30
print(a.hp, b.hp, Player.count)`),
    Q(String.raw`Что выведет программа?

‹class A:›
‹    def __init__(self): self.x = 1›
‹a = A(); b = A()›
‹a.x = 5›
‹print(b.x)›`, ['1', '5', 'Ошибку', 'None'], 0, String.raw`Поле ‹x› живёт в каждом объекте отдельно. Меняя ‹a.x›, мы не трогаем ‹b.x›.`),

    T({id:'j-oop-rect',
      text:'Напиши класс ‹Rect› с конструктором ‹Rect(w, h)›, методом ‹area()› (площадь) и методом ‹perimeter()› (периметр).',
      starter:String.raw`
class Rect:
    pass`,
      hint:'В ‹__init__(self, w, h)› сохрани ‹self.w› и ‹self.h›. Площадь ‹self.w * self.h›, периметр ‹2 * (self.w + self.h)›.',
      test:String.raw`
r = Rect(3, 4)
assert r.area() == 12, f"area() = {r.area()}"
assert r.perimeter() == 14, f"perimeter() = {r.perimeter()}"
r2 = Rect(1, 1)
assert r2.area() == 1 and r.area() == 12, "объекты должны быть независимы"`,
      solution:String.raw`
class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h

    def area(self):
        return self.w * self.h

    def perimeter(self):
        return 2 * (self.w + self.h)`}),
    T({id:'j-oop-account',
      text:'Напиши класс ‹Account›: конструктор ‹Account(owner, balance=0)›, методы ‹deposit(amount)› (пополнить) и ‹withdraw(amount)› (снять). Если денег не хватает, ‹withdraw› бросает ‹ValueError›, а баланс не меняется. Отрицательные суммы тоже запрещены (оба метода бросают ‹ValueError›).',
      starter:String.raw`
class Account:
    pass`,
      hint:'В ‹withdraw› сначала проверь ‹amount <= 0 or amount > self.balance› и сделай ‹raise ValueError(...)›, и только потом меняй баланс.',
      test:String.raw`
a = Account("Аня", 100)
a.deposit(50)
assert a.balance == 150, f"после пополнения {a.balance}"
a.withdraw(30)
assert a.balance == 120
for bad in (lambda: a.withdraw(1000), lambda: a.withdraw(-5), lambda: a.deposit(-1), lambda: a.deposit(0)):
    try:
        bad()
    except ValueError:
        pass
    else:
        raise AssertionError("нужно бросить ValueError")
assert a.balance == 120, "после ошибок баланс не должен меняться"
assert Account("Боб").balance == 0`,
      solution:String.raw`
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("сумма должна быть положительной")
        self.balance += amount

    def withdraw(self, amount):
        if amount <= 0 or amount > self.balance:
            raise ValueError("недопустимая сумма")
        self.balance -= amount`}),
    T({id:'j-oop-repr',
      text:'Напиши класс ‹Money(amount, cur="EUR")›. ‹str(Money(5, "EUR"))› должен давать ‹"5.00 EUR"› (всегда два знака), а ‹repr(...)› — ‹Money(5, \'EUR\')› (так, как выглядел бы код создания). Подсказка: у f-строки есть флаг ‹!r›.',
      starter:String.raw`
class Money:
    pass`,
      hint:'‹__str__›: ‹f"{self.amount:.2f} {self.cur}"›. ‹__repr__›: ‹f"Money({self.amount!r}, {self.cur!r})"›.',
      test:String.raw`
m = Money(5, "EUR")
assert str(m) == "5.00 EUR", f"str = {str(m)!r}"
assert repr(m) == "Money(5, 'EUR')", f"repr = {repr(m)!r}"
assert str(Money(2.5)) == "2.50 EUR", "валюта по умолчанию EUR"`,
      solution:String.raw`
class Money:
    def __init__(self, amount, cur="EUR"):
        self.amount = amount
        self.cur = cur

    def __str__(self):
        return f"{self.amount:.2f} {self.cur}"

    def __repr__(self):
        return f"Money({self.amount!r}, {self.cur!r})"`}),
    T({id:'j-oop-stack',
      text:'Напиши класс ‹Stack› (стопка): ‹push(x)› кладёт наверх, ‹pop()› снимает верхний и возвращает его (на пустом бросает ‹IndexError›), ‹peek()› смотрит верхний без снятия, ‹__len__› возвращает размер, ‹is_empty()› говорит, пуста ли стопка.',
      starter:String.raw`
class Stack:
    pass`,
      hint:'Внутри держи обычный список в ‹self.items›. ‹push› — ‹append›, ‹pop› — ‹self.items.pop()› (он сам бросит ‹IndexError›), ‹peek› — ‹self.items[-1]›.',
      test:String.raw`
s = Stack()
assert s.is_empty() and len(s) == 0
s.push(1); s.push(2); s.push(3)
assert len(s) == 3 and not s.is_empty()
assert s.peek() == 3 and len(s) == 3, "peek не должен снимать"
assert s.pop() == 3 and s.pop() == 2
assert len(s) == 1
s.pop()
try:
    s.pop()
except IndexError:
    pass
else:
    raise AssertionError("pop() на пустой стопке должен бросать IndexError")`,
      solution:String.raw`
class Stack:
    def __init__(self):
        self.items = []

    def push(self, x):
        self.items.append(x)

    def pop(self):
        return self.items.pop()

    def peek(self):
        return self.items[-1]

    def is_empty(self):
        return not self.items

    def __len__(self):
        return len(self.items)`}),
    T({id:'j-oop-vec', star:true,
      text:'Напиши класс ‹Vec2(x, y)›: сложение (‹+›), умножение на число (‹v * 3›), сравнение (‹==›) и красивое ‹repr› вида ‹Vec2(1, 2)›. Подсказка: нужны ‹__add__›, ‹__mul__›, ‹__eq__›, ‹__repr__›.',
      starter:String.raw`
class Vec2:
    pass`,
      hint:'Каждый из методов возвращает новый ‹Vec2›. ‹__eq__›: сравни обе координаты.',
      test:String.raw`
a, b = Vec2(1, 2), Vec2(10, 20)
assert a + b == Vec2(11, 22), f"a + b = {a + b!r}"
assert a * 3 == Vec2(3, 6), f"a * 3 = {a * 3!r}"
assert a == Vec2(1, 2) and a != b
assert repr(a) == "Vec2(1, 2)", f"repr = {a!r}"
assert a.x == 1, "поля x и y должны быть доступны"`,
      solution:String.raw`
class Vec2:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vec2(self.x + other.x, self.y + other.y)

    def __mul__(self, k):
        return Vec2(self.x * k, self.y * k)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __repr__(self):
        return f"Vec2({self.x}, {self.y})"`}),
  ]
});
