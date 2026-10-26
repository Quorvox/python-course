/* Джун, часть 2: наследование и dataclass, итераторы и генераторы, декораторы, коллекции */

COURSE.add('junior', {
  id:'j-oop2', title:'ООП глубже', blurb:'Наследование, property, classmethod, dataclass и композиция.',
  lead:'Как строить классы, которые не превращаются в кашу, когда программа растёт.',
  blocks:[
    S('Наследование'),
    P(String.raw`Класс может унаследовать поля и методы другого и добавить своё. Дочерний класс — частный случай родительского: «собака — это животное». ‹super()› обращается к родителю, ‹isinstance› проверяет принадлежность.`),
    C(String.raw`
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

    def intro(self):
        return f"{self.name} говорит: {self.speak()}"

class Dog(Animal):
    def speak(self):               # переопределили поведение
        return "Гав"

class Cat(Animal):
    def __init__(self, name, lives=9):
        super().__init__(name)     # сначала настроил родитель
        self.lives = lives

    def speak(self):
        return "Мяу"

for pet in [Dog("Рекс"), Cat("Мурка"), Animal("Нечто")]:
    print(pet.intro())

print(isinstance(Dog("a"), Animal), isinstance(Dog("a"), Cat))`),
    E({say:[
        String.raw`Родительский класс — общий семейный рецепт. Дочерний говорит: «Делаю всё как мама, но соус — по-своему». ‹super().__init__()› значит «сначала выполни мамину часть».`,
        String.raw`Самое полезное тут — **полиморфизм**: цикл выше не знает, кто перед ним, он просто просит ‹intro()›. Каждый ответит по-своему. Код цикла не меняется, когда добавляешь нового зверя.`],
      title:'Другая семья: фигуры',
      code:String.raw`
import math

class Shape:
    def area(self):
        raise NotImplementedError("наследник должен реализовать area")

class Square(Shape):
    def __init__(self, a): self.a = a
    def area(self): return self.a ** 2

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return round(math.pi * self.r ** 2, 2)

shapes = [Square(2), Circle(1), Square(3)]
print([s.area() for s in shapes])
print(sum(s.area() for s in shapes))`}),
    W(String.raw`Наследование — не повод тащить всё подряд. Если фраза «X — это Y» звучит странно («Двигатель — это Машина»?), используй **композицию**: объект Y содержит объект X как поле.`),

    S('Композиция'),
    C(String.raw`
class Engine:
    def __init__(self, power):
        self.power = power
    def start(self):
        return f"Мотор {self.power} л.с. запущен"

class Car:
    def __init__(self, model, power):
        self.model = model
        self.engine = Engine(power)       # Car СОДЕРЖИТ Engine

    def start(self):
        return f"{self.model}: {self.engine.start()}"

print(Car("Golf", 110).start())`),
    S('property: поле с проверкой'),
    P(String.raw`‹@property› превращает метод в «поле», которое можно проверять и вычислять. Снаружи пользоваться им так же просто, как обычным атрибутом, но внутри можно запретить неправильные значения.`),
    C(String.raw`
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius          # пройдёт через setter

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("ниже абсолютного нуля")
        self._celsius = value

    @property
    def fahrenheit(self):               # вычисляемое, без setter -> только чтение
        return self._celsius * 9 / 5 + 32

t = Temperature(100)
print(t.celsius, t.fahrenheit)
t.celsius = 0
print(t.fahrenheit)
try:
    t.celsius = -500
except ValueError as e:
    print("Ошибка:", e)`),
    N(String.raw`Подчёркивание в начале (‹_celsius›) — договорённость «это внутреннее поле, снаружи не трогай». Python не запрещает, но все программисты знают, что так делать не стоит.`),
    S('classmethod и staticmethod'),
    P(String.raw`‹@classmethod› получает класс (‹cls›) и часто служит «альтернативным конструктором». ‹@staticmethod› — обычная функция, просто живущая внутри класса из-за смысловой близости.`),
    C(String.raw`
class User:
    def __init__(self, name, age):
        self.name, self.age = name, age

    @classmethod
    def from_string(cls, text):          # "Аня,25" -> User
        name, age = text.split(",")
        return cls(name, int(age))

    @staticmethod
    def is_adult(age):
        return age >= 18

u = User.from_string("Аня,25")
print(u.name, u.age, User.is_adult(u.age))`),
    S('dataclass: класс без шаблонного кода'),
    P(String.raw`Когда класс — просто контейнер полей, писать ‹__init__›, ‹__repr__› и ‹__eq__› вручную скучно. Декоратор ‹@dataclass› делает это сам.`),
    C(String.raw`
from dataclasses import dataclass, field

@dataclass
class Item:
    title: str
    price: float
    tags: list = field(default_factory=list)   # изменяемое по умолчанию — только так
    qty: int = 1

    def total(self):
        return self.price * self.qty

a = Item("Мышь", 25.0, qty=2)
print(a)                         # красивый repr бесплатно
print(a == Item("Мышь", 25.0, qty=2))
print(a.total())

@dataclass(frozen=True, order=True)      # неизменяемый, сравнимый
class Version:
    major: int
    minor: int

print(Version(1, 2) < Version(1, 10))`),
    Q(String.raw`Что напечатает ‹print(Dog("Рекс").intro())›, если у ‹Animal› метод ‹speak› возвращает «...», а у ‹Dog› — «Гав», и ‹intro› вызывает ‹self.speak()›?`, ['Рекс говорит: ...', 'Рекс говорит: Гав', 'Ошибку', 'Гав'], 1, String.raw`‹self› — это объект класса ‹Dog›, поэтому ‹self.speak()› найдёт метод у ‹Dog› раньше, чем у родителя.`),

    T({id:'j-oop-animals',
      text:'Напиши ‹Animal(name)› с методом ‹sound()›, который возвращает ‹"..."›, и наследников ‹Dog› (звук ‹"Гав"›) и ‹Cat› (звук ‹"Мяу"›). Добавь в ‹Animal› метод ‹say()›, возвращающий ‹"<имя>: <звук>"› через вызов ‹self.sound()›.',
      starter:String.raw`
class Animal:
    pass

class Dog(Animal):
    pass

class Cat(Animal):
    pass`,
      hint:'В ‹Animal› определи ‹sound› и ‹say›. В наследниках переопредели только ‹sound›: ‹say› подхватит чужой звук сама.',
      test:String.raw`
assert Animal("x").say() == "x: ..."
assert Dog("Рекс").say() == "Рекс: Гав", f"получилось {Dog('Рекс').say()!r}"
assert Cat("Мурка").say() == "Мурка: Мяу"
assert issubclass(Dog, Animal) and issubclass(Cat, Animal)`,
      solution:String.raw`
class Animal:
    def __init__(self, name):
        self.name = name

    def sound(self):
        return "..."

    def say(self):
        return f"{self.name}: {self.sound()}"

class Dog(Animal):
    def sound(self):
        return "Гав"

class Cat(Animal):
    def sound(self):
        return "Мяу"`}),
    T({id:'j-oop-prop',
      text:'Напиши класс ‹Circle(r)› со свойством ‹r› (при записи отрицательного радиуса бросает ‹ValueError›) и только читаемыми свойствами ‹diameter› и ‹area› (площадь, округлённая ‹round(…, 2)›, ‹pi› возьми из ‹math›).',
      starter:String.raw`
import math

class Circle:
    pass`,
      hint:'Хранишь значение в ‹self._r›. ‹r› — property с setter; ‹diameter› и ‹area› — property без setter. Не забудь, что в ‹__init__› надо писать ‹self.r = r›, чтобы сработала проверка.',
      test:String.raw`
c = Circle(2)
assert c.r == 2 and c.diameter == 4
assert c.area == 12.57, f"area = {c.area}"
c.r = 1
assert c.diameter == 2
for bad in (lambda: Circle(-1), lambda: setattr(c, "r", -5)):
    try:
        bad()
    except ValueError:
        pass
    else:
        raise AssertionError("отрицательный радиус должен бросать ValueError")
try:
    c.area = 5
except AttributeError:
    pass
else:
    raise AssertionError("area должно быть только для чтения")`,
      solution:String.raw`
import math

class Circle:
    def __init__(self, r):
        self.r = r

    @property
    def r(self):
        return self._r

    @r.setter
    def r(self, value):
        if value < 0:
            raise ValueError("радиус не может быть отрицательным")
        self._r = value

    @property
    def diameter(self):
        return self._r * 2

    @property
    def area(self):
        return round(math.pi * self._r ** 2, 2)`}),
    T({id:'j-oop-fromstr',
      text:'Напиши класс ‹Point(x, y)› и классовый метод ‹Point.from_string(text)›, который разбирает строку вида ‹"3,4"› (числа могут быть отрицательными и с точкой — используй ‹float›). Добавь ‹distance_to(other)› — расстояние до другой точки (теорема Пифагора, ‹math.hypot›).',
      starter:String.raw`
import math

class Point:
    pass`,
      hint:'В ‹from_string›: ‹x, y = text.split(",")› и ‹return cls(float(x), float(y))›. Расстояние: ‹math.hypot(self.x - other.x, self.y - other.y)›.',
      test:String.raw`
p = Point.from_string("3,4")
assert (p.x, p.y) == (3.0, 4.0), f"({p.x}, {p.y})"
o = Point(0, 0)
assert p.distance_to(o) == 5.0, f"distance = {p.distance_to(o)}"
q = Point.from_string("-1.5,2")
assert (q.x, q.y) == (-1.5, 2.0)
assert isinstance(q, Point)`,
      solution:String.raw`
import math

class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    @classmethod
    def from_string(cls, text):
        x, y = text.split(",")
        return cls(float(x), float(y))

    def distance_to(self, other):
        return math.hypot(self.x - other.x, self.y - other.y)`}),
    T({id:'j-oop-dc',
      text:'Сделай через ‹@dataclass› класс ‹Book› с полями ‹title: str›, ‹author: str›, ‹pages: int = 100›, ‹tags: list› (по умолчанию новый пустой список для каждой книги!). Добавь метод ‹is_long()›: больше 300 страниц.',
      starter:String.raw`
from dataclasses import dataclass, field

class Book:
    pass`,
      hint:'Над классом поставь ‹@dataclass›. Для ‹tags› — ‹field(default_factory=list)›. Поля без значения по умолчанию должны идти раньше тех, что со значением.',
      test:String.raw`
b = Book("Идиот", "Достоевский", 640)
assert b.title == "Идиот" and b.pages == 640 and b.is_long()
assert Book("A", "B").pages == 100 and not Book("A", "B").is_long()
x, y = Book("A", "B"), Book("A", "B")
x.tags.append("новое")
assert y.tags == [], "у каждой книги должен быть свой список tags"
assert Book("A", "B") == Book("A", "B"), "dataclass сам сравнивает поля"
assert "Book(" in repr(b)`,
      solution:String.raw`
from dataclasses import dataclass, field

@dataclass
class Book:
    title: str
    author: str
    pages: int = 100
    tags: list = field(default_factory=list)

    def is_long(self):
        return self.pages > 300`}),
    T({id:'j-oop-cart', star:true,
      text:'Композиция: напиши класс ‹Cart›, который хранит товары (объекты ‹Item(title, price, qty)›, данные уже заданы). ‹add(item)› добавляет товар (если товар с таким названием уже есть, увеличивает его ‹qty›), ‹total()› возвращает сумму, ‹__len__› — общее число штук.',
      starter:String.raw`
from dataclasses import dataclass

@dataclass
class Item:
    title: str
    price: float
    qty: int = 1

class Cart:
    pass`,
      hint:'Держи в ‹self.items› словарь «название → Item». В ‹add›: если название уже есть — ‹+= qty›, иначе кладём. Только не мутируй чужой объект! Положи в корзину копию ‹Item(item.title, item.price, item.qty)›.',
      test:String.raw`
c = Cart()
assert len(c) == 0 and c.total() == 0
mouse = Item("Мышь", 25, 1)
c.add(mouse)
c.add(Item("Коврик", 8, 2))
c.add(Item("Мышь", 25, 2))
assert len(c) == 5, f"len = {len(c)}"
assert c.total() == 25 * 3 + 8 * 2, f"total = {c.total()}"
assert mouse.qty == 1, "исходный Item менять нельзя"`,
      solution:String.raw`
from dataclasses import dataclass

@dataclass
class Item:
    title: str
    price: float
    qty: int = 1

class Cart:
    def __init__(self):
        self.items = {}

    def add(self, item):
        if item.title in self.items:
            self.items[item.title].qty += item.qty
        else:
            self.items[item.title] = Item(item.title, item.price, item.qty)

    def total(self):
        return sum(i.price * i.qty for i in self.items.values())

    def __len__(self):
        return sum(i.qty for i in self.items.values())`}),
  ]
});

COURSE.add('junior', {
  id:'j-iter', title:'Итераторы и генераторы', blurb:'yield, ленивые вычисления и itertools.',
  lead:'Как обрабатывать миллион элементов, не храня их в памяти, и почему for работает с чем угодно.',
  blocks:[
    S('Как работает for'),
    P(String.raw`Когда ты пишешь ‹for x in что_то›, Python вызывает ‹iter(что_то)›, получает **итератор**, а затем снова и снова просит у него ‹next()›, пока тот не скажет «всё» (исключение ‹StopIteration›). Умеет так любой объект с методами ‹__iter__› и ‹__next__›.`),
    C(String.raw`
it = iter([10, 20, 30])
print(next(it))
print(next(it))
print(next(it))
try:
    next(it)
except StopIteration:
    print("кончились")`),
    E({say:String.raw`Итератор — раздатчик конфет. Ты просишь: «дай следующую». Он даёт, запоминает, где остановился, и больше к уже выданным не возвращается. Когда конфеты закончились — говорит «больше нет» (‹StopIteration›). ‹for› — это человек, который просто повторяет «дай следующую», пока не услышит «нет».`,
      title:'Ручной обход другого набора',
      code:String.raw`
it = iter("abc")
while True:
    try:
        ch = next(it)
    except StopIteration:
        break
    print("получил", ch)`}),
    S('Генераторы: функция с yield'),
    P(String.raw`Функция с ‹yield› вместо ‹return› становится генератором: она не выполняется сразу, а «замирает» после каждого ‹yield› и продолжается с того же места при следующем ‹next›. Значения создаются **по мере надобности**.`),
    C(String.raw`
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for x in countdown(3):
    print(x)

gen = countdown(2)
print(next(gen))
print(next(gen))
print(list(countdown(4)))`),
    HOW('Что происходит с генератором шаг за шагом', [
      'Вызов ‹countdown(3)› ничего не выполняет, а только создаёт объект-генератор.',
      'Первый ‹next› запускает тело функции до первого ‹yield›: функция отдаёт ‹3› и замирает прямо на этой строке (с сохранением ‹n›).',
      'Второй ‹next› «размораживает» функцию: она продолжает со строки после ‹yield›, делает ‹n -= 1› и доходит до следующего ‹yield›.',
      'Когда функция доходит до конца, генератор сам бросает ‹StopIteration›, и ‹for› спокойно выходит из цикла.'
    ], String.raw`
def demo():
    print("старт")
    yield 1
    print("между")
    yield 2
    print("конец")

g = demo()
print("создали, ничего не напечатано")
print(next(g))
print(next(g))`),
    S('Зачем это нужно: память'),
    C(String.raw`
import sys

big_list = [n * n for n in range(100000)]      # всё сразу в памяти
big_gen = (n * n for n in range(100000))       # круглые скобки -> генератор
print(sys.getsizeof(big_list) > 100000)
print(sys.getsizeof(big_gen) < 300)

print(sum(n * n for n in range(1000000)))      # без промежуточного списка`),
    P(String.raw`Генераторы особенно удобны для бесконечных последовательностей и потоковой обработки больших файлов — читаешь и обрабатываешь по одной строке, а не загружаешь всё.`),
    C(String.raw`
def fib():
    a, b = 0, 1
    while True:                 # бесконечный — но ленивый, потому нам не страшно
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fib(), 12)))  # первые 12 чисел`),
    W(String.raw`Генератор можно пройти **только один раз**. Если вывел его через ‹list()› или прошёл циклом, то второй раз он будет пуст. Нужно ещё раз — создай новый.`),
    S('itertools: набор полезных инструментов'),
    C(String.raw`
from itertools import chain, islice, product, permutations, combinations, count

print(list(chain([1, 2], "ab")))             # склеить итерируемые
print(list(combinations("abc", 2)))          # сочетания по 2
print(list(permutations([1, 2, 3], 2))[:4])
print(list(product("ab", [0, 1])))           # декартово произведение
print(list(islice(count(10, 5), 4)))         # 10, 15, 20, 25`),
    Q(String.raw`Сколько раз выведется «до» и «после»?

‹def g():›
‹    print("до"); yield 1; print("после")›
‹x = g()›`, ['«до» один раз, «после» один раз', 'Ни разу — пока не вызовут next', '«до» один раз, «после» ни разу', 'Ошибка'], 1, String.raw`Вызов ‹g()› только создаёт генератор. Тело функции начнёт выполняться лишь после первого ‹next(x)›.`),

    T({id:'j-gen-even',
      text:'Напиши генератор ‹evens(limit)›: выдаёт чётные числа от 0 до ‹limit› включительно по возрастанию.',
      starter:String.raw`
def evens(limit):
    pass`,
      hint:'Используй ‹yield› в цикле по ‹range(0, limit + 1, 2)›.',
      test:String.raw`
import types
g = evens(10)
assert isinstance(g, types.GeneratorType), "функция должна быть генератором (с yield)"
assert list(g) == [0, 2, 4, 6, 8, 10], f"получилось {list(evens(10))}"
assert list(evens(0)) == [0]
assert list(evens(5)) == [0, 2, 4]`,
      solution:String.raw`
def evens(limit):
    for n in range(0, limit + 1, 2):
        yield n`}),
    T({id:'j-gen-chunks',
      text:'Напиши генератор ‹chunks(items, size)›: режет список на куски по ‹size› элементов (последний может быть короче). ‹list(chunks([1,2,3,4,5], 2))› даёт ‹[[1,2],[3,4],[5]]›.',
      starter:String.raw`
def chunks(items, size):
    pass`,
      hint:'Цикл ‹for i in range(0, len(items), size)›, а внутри ‹yield items[i:i + size]›.',
      test:String.raw`
assert list(chunks([1, 2, 3, 4, 5], 2)) == [[1, 2], [3, 4], [5]]
assert list(chunks([], 3)) == []
assert list(chunks("abcdef", 3)) == ["abc", "def"]
assert list(chunks([1, 2, 3], 10)) == [[1, 2, 3]]`,
      solution:String.raw`
def chunks(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]`}),
    T({id:'j-gen-primes',
      text:'Напиши бесконечный генератор ‹primes()›, выдающий простые числа по порядку: 2, 3, 5, 7, 11… Проверка возьмёт первые несколько штук.',
      starter:String.raw`
def primes():
    pass`,
      hint:'Цикл ‹n = 2, 3, 4…› без конца (‹while True›). Для каждого проверь делимость на числа от 2 до корня; если делителей нет — ‹yield n›.',
      test:String.raw`
from itertools import islice
got = list(islice(primes(), 10))
assert got == [2, 3, 5, 7, 11, 13, 17, 19, 23, 29], f"получилось {got}"
p = primes()
assert next(p) == 2 and next(p) == 3`,
      solution:String.raw`
def primes():
    n = 2
    while True:
        d = 2
        while d * d <= n and n % d:
            d += 1
        if d * d > n:
            yield n
        n += 1`}),
    T({id:'j-gen-pipe',
      text:'Собери конвейер из генераторов. ‹numbers()› уже есть. Напиши ‹squares(src)› (возводит каждое число в квадрат) и ‹only_big(src, limit)› (пропускает только значения больше ‹limit›). В ‹result› положи список из ‹only_big(squares(numbers()), 20)›.',
      starter:String.raw`
def numbers():
    for n in range(1, 11):
        yield n

def squares(src):
    pass

def only_big(src, limit):
    pass

result = []`,
      hint:'Каждый генератор берёт другой генератор и в цикле ‹for x in src› делает ‹yield›. Конвейер читается справа налево: цифры → квадраты → фильтр.',
      test:String.raw`
assert result == [25, 36, 49, 64, 81, 100], f"result = {result}"
assert list(squares(iter([1, 2, 3]))) == [1, 4, 9]
assert list(only_big(iter([5, 50, 7, 70]), 10)) == [50, 70]`,
      solution:String.raw`
def numbers():
    for n in range(1, 11):
        yield n

def squares(src):
    for x in src:
        yield x * x

def only_big(src, limit):
    for x in src:
        if x > limit:
            yield x

result = list(only_big(squares(numbers()), 20))`}),
    T({id:'j-gen-iter', star:true,
      text:'Напиши класс-итератор ‹Countdown(start)›, который в цикле ‹for› выдаёт числа от ‹start› до 1. Реализуй вручную ‹__iter__› (возвращает ‹self›) и ‹__next__› (на конце бросает ‹StopIteration›).',
      starter:String.raw`
class Countdown:
    pass`,
      hint:'В ‹__init__› сохрани ‹self.n = start›. В ‹__next__›: если ‹self.n <= 0› — ‹raise StopIteration›; иначе уменьши ‹n› и верни прежнее значение.',
      test:String.raw`
assert list(Countdown(3)) == [3, 2, 1], f"получилось {list(Countdown(3))}"
assert list(Countdown(0)) == []
it = Countdown(1)
assert next(it) == 1
try:
    next(it)
except StopIteration:
    pass
else:
    raise AssertionError("после последнего значения должен быть StopIteration")`,
      solution:String.raw`
class Countdown:
    def __init__(self, start):
        self.n = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        value = self.n
        self.n -= 1
        return value`}),
  ]
});

COURSE.add('junior', {
  id:'j-deco', title:'Декораторы и with', blurb:'Оборачиваем функции, измеряем время и управляем ресурсами.',
  lead:'Декораторы — самая «магическая» часть Python, и на собеседованиях про неё спрашивают чаще всего. Разберём без магии.',
  blocks:[
    S('Идея: обернуть функцию'),
    P(String.raw`Декоратор — это функция, которая принимает функцию и возвращает новую, обычно «обёрнутую» дополнительным поведением: логирование, замер времени, кэш, проверка прав. Строка ‹@decorator› над ‹def› — сокращённая запись для ‹f = decorator(f)›.`),
    C(String.raw`
def shout(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper() + "!"
    return wrapper

@shout
def hello(name):
    return f"привет, {name}"

print(hello("Коля"))        # ПРИВЕТ, КОЛЯ!`),
    E({say:String.raw`Подарок и упаковка. Функция — сам подарок. Декоратор — упаковочная бумага с бантиком: подарок внутри тот же, но выглядит иначе и перед вручением ещё что-нибудь происходит (бантик завязали, открытку вложили). Кто получает подарок, разворачивает именно упаковку, а не подарок напрямую.`,
      title:'Другая упаковка: логирование вызова',
      code:String.raw`
def log_call(func):
    def wrapper(*args, **kwargs):
        print(f"вызываю {func.__name__}{args}")
        result = func(*args, **kwargs)
        print(f"вернула {result}")
        return result
    return wrapper

@log_call
def add(a, b):
    return a + b

add(2, 3)`}),
    HOW('Что делает @shout на самом деле', [
      'Python сначала создаёт обычную функцию ‹hello›.',
      'Потом выполняет ‹hello = shout(hello)›: передаёт оригинал в декоратор.',
      '‹shout› возвращает функцию ‹wrapper›, в которой «зашита» ссылка на оригинал (замыкание).',
      'Теперь имя ‹hello› указывает на ‹wrapper›. Когда ты вызываешь ‹hello("Коля")›, на самом деле выполняется ‹wrapper›, который вызывает оригинал и дописывает «!».'
    ]),
    S('functools.wraps'),
    P(String.raw`Без доработки обёртка «подменяет» имя и документацию функции на свои. Декоратор ‹functools.wraps› копирует их обратно. Привыкай ставить его всегда.`),
    C(String.raw`
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} заняла {time.perf_counter() - start:.4f} с")
        return result
    return wrapper

@timer
def slow_sum(n):
    """Сумма чисел."""
    return sum(range(n))

print(slow_sum(1000000))
print(slow_sum.__name__, "|", slow_sum.__doc__)`),
    S('Декоратор с параметрами'),
    P(String.raw`Если декоратору нужны настройки (‹@repeat(3)›), понадобится ещё один уровень вложенности: внешняя функция принимает настройки, возвращает декоратор.`),
    C(String.raw`
from functools import wraps

def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def ping():
    print("пинг")

ping()`),
    S('Кэш из коробки'),
    C(String.raw`
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(80))             # без кэша это считалось бы вечность
print(fib.cache_info().hits > 0)`),

    S('with и контекстные менеджеры'),
    P(String.raw`‹with› гарантирует, что после блока что-то будет сделано обязательно — даже если внутри упала ошибка: файл закрыт, соединение отпущено, замок снят. Свой менеджер делается двумя способами: классом с ‹__enter__› / ‹__exit__› или функцией с ‹@contextmanager›.`),
    C(String.raw`
from contextlib import contextmanager

@contextmanager
def section(title):
    print(f"--- начало: {title}")
    try:
        yield
    finally:
        print(f"--- конец: {title}")

with section("расчёты"):
    print(2 + 2)

try:
    with section("с ошибкой"):
        1 / 0
except ZeroDivisionError:
    print("ошибку поймали, но конец блока всё равно напечатался")`),
    C(String.raw`
class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc, tb):
        import time
        self.elapsed = time.perf_counter() - self.start
        return False            # False -> ошибки не глотаем

with Timer() as t:
    sum(range(100000))
print(t.elapsed >= 0)`),
    Q(String.raw`К чему равно ‹hello› после ‹@shout def hello(): …›?`, ['Оригинальная функция hello', 'Результат вызова shout(hello)', 'None', 'Строка "shout"'], 1, String.raw`‹@shout› — сокращение для ‹hello = shout(hello)›. Имя теперь указывает на то, что вернул декоратор (обёртку).`),

    T({id:'j-deco-count',
      text:'Напиши декоратор ‹counted›: считает, сколько раз вызвана функция. Счётчик доступен как атрибут ‹func.calls›. Не забудь ‹functools.wraps›.',
      starter:String.raw`
from functools import wraps

def counted(func):
    pass`,
      hint:'Внутри ‹wrapper› делай ‹wrapper.calls += 1›, а до возврата поставь ‹wrapper.calls = 0›.',
      test:String.raw`
@counted
def f(x):
    """док"""
    return x * 2

assert f.calls == 0
assert f(2) == 4 and f(3) == 6
assert f.calls == 2, f"calls = {f.calls}"
assert f.__name__ == "f" and f.__doc__ == "док", "используй functools.wraps"`,
      solution:String.raw`
from functools import wraps

def counted(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper`}),
    T({id:'j-deco-validate',
      text:'Напиши декоратор ‹positive_args›: перед вызовом проверяет, что все позиционные аргументы больше нуля; иначе бросает ‹ValueError›.',
      starter:String.raw`
from functools import wraps

def positive_args(func):
    pass`,
      hint:'В ‹wrapper(*args, **kwargs)› пройдись по ‹args›: если какой-то ‹a <= 0› — ‹raise ValueError›. Иначе вызови ‹func›.',
      test:String.raw`
@positive_args
def area(w, h):
    return w * h

assert area(2, 3) == 6
for bad in [(0, 5), (-1, 2), (3, -3)]:
    try:
        area(*bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"area{bad} должна бросать ValueError")`,
      solution:String.raw`
from functools import wraps

def positive_args(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        for a in args:
            if a <= 0:
                raise ValueError("аргументы должны быть положительными")
        return func(*args, **kwargs)
    return wrapper`}),
    T({id:'j-deco-retry',
      text:'Напиши декоратор с параметром ‹retry(times)›: вызывает функцию, и если она бросила исключение — пробует снова, до ‹times› попыток всего. Если все попытки неудачны — пробрасывает последнее исключение.',
      starter:String.raw`
from functools import wraps

def retry(times):
    pass`,
      hint:'Три уровня: ‹retry(times)› → ‹decorator(func)› → ‹wrapper›. В ‹wrapper›: цикл по попыткам, внутри ‹try› с ‹return func(...)›, в ‹except› запоминаем ошибку, а после цикла ‹raise last›.',
      test:String.raw`
attempts = []

@retry(3)
def flaky():
    attempts.append(1)
    if len(attempts) < 3:
        raise RuntimeError("не вышло")
    return "ок"

assert flaky() == "ок", "на третьей попытке должно получиться"
assert len(attempts) == 3

calls = []
@retry(2)
def broken():
    calls.append(1)
    raise KeyError("всегда падает")

try:
    broken()
except KeyError:
    assert len(calls) == 2, f"попыток должно быть 2, а было {len(calls)}"
else:
    raise AssertionError("после всех неудач ошибка должна пробрасываться")`,
      solution:String.raw`
from functools import wraps

def retry(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last = None
            for _ in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last = e
            raise last
        return wrapper
    return decorator`}),
    T({id:'j-deco-ctx', star:true,
      text:'Напиши контекстный менеджер ‹collect_output()› через ‹@contextmanager›: внутри ‹with› всё, что печатает ‹print›, не выводится, а собирается; после блока результат доступен как ‹buf.getvalue()›. Подсказка: ‹contextlib.redirect_stdout› и ‹io.StringIO›.',
      starter:String.raw`
import io
from contextlib import contextmanager, redirect_stdout

@contextmanager
def collect_output():
    pass`,
      hint:'Создай ‹buf = io.StringIO()›, внутри ‹with redirect_stdout(buf):› сделай ‹yield buf›.',
      test:String.raw`
with collect_output() as buf:
    print("привет")
    print("мир")
assert buf.getvalue() == "привет\nмир\n", f"получилось {buf.getvalue()!r}"
print("эта строка вне блока")`,
      solution:String.raw`
import io
from contextlib import contextmanager, redirect_stdout

@contextmanager
def collect_output():
    buf = io.StringIO()
    with redirect_stdout(buf):
        yield buf`}),
  ]
});

COURSE.add('junior', {
  id:'j-collections', title:'Коллекции и структуры данных', blurb:'Counter, defaultdict, deque, namedtuple, heapq и сложность O(n).',
  lead:'Правильная структура данных часто убирает половину кода и превращает «тормозит» в «летает».',
  blocks:[
    S('Counter и defaultdict'),
    P(String.raw`Подсчёт и группировка — две самые частые задачи. Для них в ‹collections› есть готовые инструменты: ‹Counter› считает, ‹defaultdict› сам создаёт значение для нового ключа.`),
    C(String.raw`
from collections import Counter, defaultdict

words = "да нет да может да нет".split()
c = Counter(words)
print(c)
print(c["да"], c["никогда"])         # отсутствующий ключ = 0, а не ошибка
print(c.most_common(2))

groups = defaultdict(list)
for w in ["apple", "avocado", "banana", "blueberry", "cherry"]:
    groups[w[0]].append(w)
print(dict(groups))`),
    E({say:String.raw`‹Counter› — бухгалтер, который сам ведёт палочки: бросаешь слово — он ставит палочку. ‹defaultdict› — вежливый словарь: если ключа нет, он не кричит «ошибка!», а молча заводит новую пустую коробку нужного вида (список, число — как ты ему сказал), и кладёт туда.`,
      title:'Другая бухгалтерия: оценки и ученики',
      code:String.raw`
from collections import Counter, defaultdict

marks = [5, 4, 5, 3, 5, 4]
print(Counter(marks).most_common())

by_class = defaultdict(list)
for cls, name in [("9А", "Аня"), ("9Б", "Борис"), ("9А", "Вика")]:
    by_class[cls].append(name)
print(dict(by_class))`}),
    S('deque: очередь'),
    P(String.raw`У списка вставка и удаление в начале медленные (все элементы сдвигаются). ‹deque› быстро добавляет и убирает с обоих концов — идеален для очередей.`),
    C(String.raw`
from collections import deque

q = deque()
q.append("первый")
q.append("второй")
q.appendleft("срочный")
print(q.popleft())          # срочный
print(list(q))

last3 = deque(maxlen=3)     # хранит только 3 последних
for i in range(10):
    last3.append(i)
print(last3)`),
    S('namedtuple'),
    C(String.raw`
from collections import namedtuple

Point = namedtuple("Point", "x y")
p = Point(3, 4)
print(p, p.x, p[1])
x, y = p                      # распаковка работает
print(p._replace(x=10))       # «изменить» = создать новый`),
    S('heapq: кучи'),
    P(String.raw`Куча умеет за доли секунды отдавать минимум из набора и принимать новые числа. Нужна для «топ-N», расписаний и приоритетных очередей.`),
    C(String.raw`
import heapq

nums = [9, 1, 7, 3, 8]
heapq.heapify(nums)
print(heapq.heappop(nums))      # 1
heapq.heappush(nums, 0)
print(heapq.heappop(nums))      # 0

print(heapq.nlargest(2, [5, 9, 1, 7]))
print(heapq.nsmallest(2, [5, 9, 1, 7]))`),
    S('Скорость: что значит O(n)'),
    P(String.raw`**O-нотация** описывает, как растёт время работы с ростом данных. Не секунды, а темп роста. Это ровно то, о чём спрашивают на собеседованиях.`),
    TB(['Сложность', 'Что значит', 'Пример'], [
      ['O(1)', 'не зависит от размера', 'взять ‹a[5]›, ‹d["k"]›, ‹x in set›'],
      ['O(n)', 'растёт пропорционально', '‹x in list›, ‹sum(a)›, один цикл'],
      ['O(n log n)', 'чуть больше линейной', '‹sorted(a)›'],
      ['O(n²)', 'квадрат: беда на больших данных', 'цикл в цикле по одному списку'],
    ]),
    C(String.raw`
import time

N = 20000
data_list = list(range(N))
data_set = set(data_list)
targets = range(N - 2000, N)     # ищем «дальние» элементы

t = time.perf_counter()
hits = sum(1 for x in targets if x in data_list)       # O(n) на каждый поиск
t_list = time.perf_counter() - t

t = time.perf_counter()
hits2 = sum(1 for x in targets if x in data_set)       # O(1) на каждый поиск
t_set = time.perf_counter() - t

print(hits == hits2, "множество быстрее в", round(t_list / max(t_set, 1e-9)), "раз")`),
    N(String.raw`Правило на каждый день: если много раз спрашиваешь «есть ли такой элемент» — храни данные в ‹set› или ‹dict›, а не в списке.`),
    Q(String.raw`Что быстрее для проверки «есть ли элемент» на миллионе значений?`, ['list', 'set', 'Одинаково', 'tuple'], 1, String.raw`В списке Python может перебрать весь миллион, а множество находит элемент по хэшу почти сразу (O(1)).`),

    T({id:'j-col-top',
      text:'Дан текст ‹text›. Запиши в ‹top› список из трёх самых частых слов (в нижнем регистре) в порядке убывания частоты. Для равных частот порядок первого появления.',
      starter:String.raw`
text = "Да нет да Может да нет НЕТ может"
top = []`,
      hint:'‹Counter(text.lower().split()).most_common(3)› возвращает пары (слово, число). Возьми только слова.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("text ="))
g = {"text": "a b A c B a d"}; exec(body, g)
assert g["top"] == ["a", "b", "c"], f"получилось {g['top']}"`,
      solution:String.raw`
from collections import Counter

text = "Да нет да Может да нет НЕТ может"
top = [w for w, n in Counter(text.lower().split()).most_common(3)]`}),
    T({id:'j-col-group',
      text:'Есть список слов ‹words›. Собери в ‹by_len› словарь «длина слова → список слов этой длины» (в порядке появления), используя ‹defaultdict›. Итог приведи к обычному ‹dict›.',
      starter:String.raw`
from collections import defaultdict

words = ["кот", "собака", "мышь", "лев", "волк", "осёл"]
by_len = {}`,
      hint:'‹groups = defaultdict(list)›, в цикле ‹groups[len(w)].append(w)›, в конце ‹by_len = dict(groups)›.',
      test:String.raw`
assert by_len == {3: ["кот", "лев"], 6: ["собака"], 4: ["мышь", "волк", "осёл"]}, f"получилось {by_len}"
assert type(by_len) is dict, "в конце приведи результат к обычному dict"`,
      solution:String.raw`
from collections import defaultdict

words = ["кот", "собака", "мышь", "лев", "волк", "осёл"]
groups = defaultdict(list)
for w in words:
    groups[len(w)].append(w)
by_len = dict(groups)`}),
    T({id:'j-col-queue',
      text:'Задача «Считалка»: по кругу стоят люди из списка ‹people›. Каждого ‹k›-го выбывает, пока не останется один. Напиши ‹last_man(people, k)›, возвращающую имя последнего. Используй ‹deque› и его метод ‹rotate›.',
      starter:String.raw`
from collections import deque

def last_man(people, k):
    pass`,
      hint:'‹q = deque(people)›. Пока ‹len(q) > 1›: сделай ‹q.rotate(-(k - 1))› (сдвигаем k-1 человек в конец), а потом ‹q.popleft()›. Тот, кто стал первым, выбывает.',
      test:String.raw`
assert last_man(["А", "Б", "В", "Г", "Д"], 2) == "В", f"получилось {last_man(['А', 'Б', 'В', 'Г', 'Д'], 2)}"
assert last_man(["А"], 3) == "А"
assert last_man(["А", "Б", "В"], 1) == "В"
assert last_man(list("abcdefg"), 3) == "d"`,
      solution:String.raw`
from collections import deque

def last_man(people, k):
    q = deque(people)
    while len(q) > 1:
        q.rotate(-(k - 1))
        q.popleft()
    return q[0]`}),
    T({id:'j-col-heap',
      text:'Напиши ‹k_smallest(nums, k)›: вернуть ‹k› наименьших чисел по возрастанию. Через ‹heapq›, не через ‹sorted›.',
      starter:String.raw`
import heapq

def k_smallest(nums, k):
    pass`,
      hint:'Есть готовая ‹heapq.nsmallest(k, nums)›.',
      test:String.raw`
assert "sorted(" not in __src__.replace("def k_smallest", ""), "используй heapq, а не sorted"
assert k_smallest([5, 1, 9, 3, 7], 3) == [1, 3, 5]
assert k_smallest([2], 1) == [2]
assert k_smallest([4, 4, 1], 2) == [1, 4]
assert k_smallest([1, 2, 3], 0) == []`,
      solution:String.raw`
import heapq

def k_smallest(nums, k):
    return heapq.nsmallest(k, nums)`}),
    T({id:'j-col-two', star:true,
      text:'Классика собеседований «Two Sum». Напиши ‹two_sum(nums, target)›: найди два **разных по позиции** числа, дающих в сумме ‹target›, и верни их индексы как кортеж ‹(i, j)› с ‹i < j›. Если нет — ‹None›. Решение за один проход, O(n), через словарь.',
      starter:String.raw`
def two_sum(nums, target):
    pass`,
      hint:'Идём по числам и храним словарь «число → индекс». Для каждого ‹x› спрашиваем: лежит ли уже ‹target - x›? Если да — нашли пару.',
      test:String.raw`
assert two_sum([2, 7, 11, 15], 9) == (0, 1), f"получилось {two_sum([2, 7, 11, 15], 9)}"
assert two_sum([3, 2, 4], 6) == (1, 2)
assert two_sum([3, 3], 6) == (0, 1)
assert two_sum([1, 2, 3], 100) is None
import time
big = list(range(200000))
t = time.perf_counter()
assert two_sum(big, 399997) == (199998, 199999)
assert time.perf_counter() - t < 2, "решение слишком медленное, нужен один проход со словарём"`,
      solution:String.raw`
def two_sum(nums, target):
    seen = {}
    for j, x in enumerate(nums):
        i = seen.get(target - x)
        if i is not None:
            return (i, j)
        seen[x] = j
    return None`}),
  ]
});
