/* Стажёр, часть 3: функции, ошибки, файлы, два проекта */

COURSE.add('trainee', {
  id:'functions', title:'Функции', blurb:'Один раз написал, вызываешь сколько угодно.',
  lead:'Как не повторять код и держать программу в порядке.',
  blocks:[
    S('Зачем нужны функции'),
    P(String.raw`Функция — именованный кусок кода, который можно вызывать много раз. Создаётся через ‹def›, результат отдаётся через ‹return›. Ты уже пользовался готовыми функциями: ‹print›, ‹len›, ‹int›. Теперь пишем свои.`),
    C(String.raw`
def greet(name):
    return f"Привет, {name}!"

print(greet("Коля"))
print(greet("мир"))`),
    E({say:[
        String.raw`Функция — кофемашина. Один раз собрал (написал ‹def›), потом кладёшь внутрь зёрна (параметр ‹name›), нажимаешь кнопку (вызов ‹greet("Коля")›), и получаешь напиток (результат ‹return›).`,
        String.raw`Пока ты не нажал кнопку, внутри ничего не происходит. Описать функцию и вызвать её — две разные вещи.`],
      title:'Другая машина: превращаем градусы',
      code:String.raw`
def to_fahrenheit(celsius):
    return celsius * 9 / 5 + 32

print(to_fahrenheit(0))
print(to_fahrenheit(100))
print(to_fahrenheit(-40))`}),
    HOW('Что происходит при вызове greet("Коля")', [
      'Python доходит до строки с ‹def› и просто запоминает: «есть функция ‹greet›». Внутрь он пока не заглядывает.',
      'Дальше встречается вызов ‹greet("Коля")›. Python создаёт временный мир функции, где ‹name› равно ‹"Коля"›.',
      'Выполняются строки тела функции. Дойдя до ‹return›, Python берёт значение справа и передаёт его туда, откуда вызвали.',
      'Временный мир функции удаляется вместе со всеми её переменными. Остаётся только то, что вернули.'
    ], String.raw`
def greet(name):
    text = f"Привет, {name}!"
    return text

result = greet("Коля")
print(result)
# print(text)   # ошибка: text жил только внутри функции`),

    S('print и return — не одно и то же'),
    P(String.raw`Важное различие: ‹print› только показывает значение на экране, а ‹return› **отдаёт** его наружу, и с ним можно что-то делать дальше. Функция без ‹return› вернёт ‹None›.`),
    C(String.raw`
def double_print(x):
    print(x * 2)

def double_return(x):
    return x * 2

a = double_print(5)    # напечатает 10, но a станет None
b = double_return(5)   # ничего не печатает, b = 10
print(a, b)
print(double_return(double_return(3)))   # результат можно подать в другую функцию`),
    E({say:String.raw`‹print› — это сказать результат вслух: услышали все, но в руках у тебя ничего нет. ‹return› — положить результат тебе в руки: теперь ты можешь его сложить, умножить или передать дальше. Если нужно считать дальше — всегда ‹return›. ‹print› — только чтобы показать человеку.`,
      title:'Другой пример: налог',
      code:String.raw`
def tax(price):
    return price * 0.2

def tax_show(price):
    print(price * 0.2)

t = tax(50)
print("Налог в переменной:", t, "| ещё +1:", t + 1)
r = tax_show(50)
print("А тут пусто:", r)`}),
    Q(String.raw`Что будет в ‹x› после ‹x = print("Hi")›?`, ['"Hi"', 'None', 'Ошибка', '0'], 1, String.raw`‹print› показывает текст, но ничего не возвращает — результатом вызова будет ‹None›.`),

    S('Параметры'),
    P(String.raw`У параметра может быть значение по умолчанию, тогда его можно не передавать. Аргументы можно передавать по имени. Переменные, созданные внутри функции, живут только внутри неё.`),
    C(String.raw`
def power(base, exp=2):
    return base ** exp

print(power(5))                # 25
print(power(2, 10))            # 1024
print(power(exp=3, base=2))    # 8, аргументы можно передавать по именам`),
    S('Вернуть несколько значений'),
    P(String.raw`‹return a, b› возвращает кортеж, который сразу можно распаковать.`),
    C(String.raw`
def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([4, 9, 1, 7])
print(lo, hi)`),
    S('Хорошая функция'),
    L([
      'Делает **одно** дело и называется глаголом: ‹calc_total›, ‹is_valid›, ‹send_message›.',
      'Принимает данные через параметры и возвращает результат, а не лезет в чужие переменные.',
      'Если комментарий пересказывает код — переименуй функцию. Если код повторился в трёх местах — вынеси его в функцию.',
    ]),
    P(String.raw`Для пояснения в функции пишут **docstring** — текст в тройных кавычках сразу под ‹def›. Он не выполняется, а работает как справка (её показывает ‹help()›).`),
    C(String.raw`
def area(w, h):
    """Площадь прямоугольника."""
    return w * h

print(area(3, 4))
print(area.__doc__)`),

    T({id:'fn-even',
      text:'Напиши функцию ‹is_even(n)›: возвращает ‹True› для чётных чисел и ‹False› для нечётных.',
      starter:String.raw`
def is_even(n):
    pass`,
      hint:'Число чётное, если остаток от деления на 2 равен нулю: ‹n % 2 == 0›.',
      test:String.raw`
assert is_even(4) is True, "is_even(4) должна вернуть True"
assert is_even(7) is False, "is_even(7) должна вернуть False"
assert is_even(0) is True, "is_even(0) должна вернуть True"`,
      solution:String.raw`
def is_even(n):
    return n % 2 == 0`}),
    T({id:'fn-vat',
      text:'В Германии НДС 19 % (на еду и книги — 7 %). Напиши ‹price_with_vat(net, rate=0.19)›: цена с налогом, округлённая до двух знаков через ‹round(x, 2)›.',
      starter:String.raw`
def price_with_vat(net, rate=0.19):
    pass`,
      hint:'Цена с налогом — это ‹net * (1 + rate)›.',
      test:String.raw`
assert price_with_vat(100) == 119.0, f"price_with_vat(100) = {price_with_vat(100)}, нужно 119.0"
assert price_with_vat(50, 0.07) == 53.5, f"price_with_vat(50, 0.07) = {price_with_vat(50, 0.07)}, нужно 53.5"
assert price_with_vat(9.99) == 11.89, f"price_with_vat(9.99) = {price_with_vat(9.99)}, нужно 11.89"`,
      solution:String.raw`
def price_with_vat(net, rate=0.19):
    return round(net * (1 + rate), 2)`}),
    T({id:'fn-max3',
      text:'Напиши ‹biggest(a, b, c)›, которая возвращает наибольшее из трёх чисел. Встроенным ‹max› пользоваться нельзя — сравни сам через ‹if›.',
      starter:String.raw`
def biggest(a, b, c):
    pass`,
      hint:'Заведи ‹best = a›. Потом: если ‹b > best› — запомни ‹b›; то же для ‹c›. В конце ‹return best›.',
      test:String.raw`
assert "max(" not in __src__, "встроенным max() пользоваться нельзя"
for args, want in [((1, 2, 3), 3), ((9, 2, 3), 9), ((1, 8, 3), 8), ((-5, -2, -9), -2), ((4, 4, 4), 4)]:
    assert biggest(*args) == want, f"biggest{args} должна вернуть {want}, а у тебя {biggest(*args)}"`,
      solution:String.raw`
def biggest(a, b, c):
    best = a
    if b > best:
        best = b
    if c > best:
        best = c
    return best`}),
    T({id:'fn-vowels',
      text:'Напиши ‹count_vowels(text)›: сколько в тексте гласных русских букв (а, е, ё, и, о, у, ы, э, ю, я), без учёта регистра.',
      starter:String.raw`
def count_vowels(text):
    pass`,
      hint:'Заведи строку ‹vowels = "аеёиоуыэюя"›, пройди по буквам ‹text.lower()› и считай, у которых ‹letter in vowels›.',
      test:String.raw`
assert count_vowels("Привет") == 2, f'для "Привет" нужно 2, а у тебя {count_vowels("Привет")}'
assert count_vowels("") == 0, "для пустой строки нужно 0"
assert count_vowels("ЁЖИК") == 2, "регистр не должен влиять"
assert count_vowels("шшш") == 0`,
      solution:String.raw`
def count_vowels(text):
    vowels = "аеёиоуыэюя"
    n = 0
    for letter in text.lower():
        if letter in vowels:
            n += 1
    return n`}),
    T({id:'fn-stats',
      text:'Напиши ‹stats(nums)›: возвращает кортеж из трёх значений — ‹(минимум, максимум, среднее)›. Среднее округли до двух знаков.',
      starter:String.raw`
def stats(nums):
    pass`,
      hint:'‹return min(nums), max(nums), round(sum(nums) / len(nums), 2)›.',
      test:String.raw`
assert stats([1, 2, 3, 4]) == (1, 4, 2.5), f"stats([1, 2, 3, 4]) = {stats([1, 2, 3, 4])}, нужно (1, 4, 2.5)"
assert stats([10]) == (10, 10, 10), "для одного числа min, max и среднее совпадают"
assert stats([1, 2, 2]) == (1, 2, 1.67), f"stats([1, 2, 2]) = {stats([1, 2, 2])}, нужно (1, 2, 1.67)"`,
      solution:String.raw`
def stats(nums):
    return min(nums), max(nums), round(sum(nums) / len(nums), 2)`}),
    T({id:'fn-prime', star:true,
      text:'Напиши ‹is_prime(n)›: ‹True›, если ‹n› простое (делится только на 1 и на себя), иначе ‹False›. Числа меньше 2 простыми не считаются.',
      starter:String.raw`
def is_prime(n):
    pass`,
      hint:'Если ‹n < 2› — сразу ‹False›. Иначе пройди ‹d› от 2 до ‹n - 1›: если ‹n % d == 0› — не простое. Если ничего не нашёл — простое. Для скорости хватит идти до корня: ‹d * d <= n›.',
      test:String.raw`
primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 97}
for n in list(range(-3, 31)) + [97, 100, 91, 121]:
    want = n in primes
    assert is_prime(n) is want, f"is_prime({n}) должна вернуть {want}"`,
      solution:String.raw`
def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True`}),
  ]
});

COURSE.add('trainee', {
  id:'errors', title:'Ошибки', blurb:'Читать traceback и не давать программе падать.',
  lead:'Ошибки — часть работы. Учимся их читать и перехватывать.',
  blocks:[
    S('Как читать ошибку'),
    P(String.raw`Когда код падает, Python пишет, **что** случилось и **на какой строке**. Читай последнюю строку сообщения: в ней тип ошибки.`),
    C(String.raw`
print("до")
print(10 / 0)
print("после")   # сюда программа не дойдёт`, {fails:true}),
    HOW('Алгоритм «что делать, когда упало»', [
      'Не пугайся красного текста. Он нужен для помощи, а не для наказания.',
      'Найди **последнюю строку** сообщения: там тип ошибки и короткое объяснение («division by zero»).',
      'Найди **номер строки** вашего кода (на этой странице он уже показан: «строка 2: …»).',
      'Посмотри на эту строку и на строку выше: чаще всего проблема там.',
      'Если непонятно — вставь ‹print()› рядом, чтобы увидеть, что на самом деле лежит в переменных.',
    ]),
    S('Частые ошибки'),
    TB(['Ошибка', 'Что значит', 'Пример'], [
      ['‹SyntaxError›', 'опечатка в самом коде', '‹print("a›'],
      ['‹NameError›', 'такой переменной нет', '‹print(x)› до ‹x = 1›'],
      ['‹TypeError›', 'не тот тип', '‹"5" + 5›'],
      ['‹ValueError›', 'тип верный, значение нет', '‹int("abc")›'],
      ['‹KeyError›', 'нет такого ключа в словаре', '‹{}["a"]›'],
      ['‹IndexError›', 'нет такого номера в списке', '‹[1][5]›'],
      ['‹ZeroDivisionError›', 'деление на ноль', '‹1 / 0›'],
    ]),
    E({say:[
        String.raw`Ошибка — это записка от Python: «я хотел сделать то, что ты написал, но не смог, вот почему». Не ругань, а отчёт.`,
        String.raw`Каждый тип ошибки — это название поломки. Как у врача: «ушиб», «перелом». Узнал название — сразу понял, где искать.`],
      title:'Три записки подряд, чтобы привыкнуть',
      code:String.raw`
tries = [lambda: int("abc"), lambda: [1, 2][7], lambda: {"a": 1}["b"]]
for f in tries:
    try:
        f()
    except Exception as e:
        print(type(e).__name__, "->", e)`}),

    S('try / except: не дать программе упасть'),
    P(String.raw`Чтобы программа не падала, ошибку перехватывают: опасный код пишется в ‹try›, реакция на ошибку — в ‹except›.`),
    C(String.raw`
text = "abc"
try:
    number = int(text)
    print("Число:", number)
except ValueError:
    print("Это не число:", text)
print("Программа жива")`),
    E({say:String.raw`Под акробатом натянута страховочная сетка. Если всё хорошо — сетка не нужна. Если он падает (ошибка) — сетка ловит, и представление продолжается. ‹try› — это трюк, ‹except› — сетка.`,
      title:'Другая сетка: деление',
      code:String.raw`
for d in [5, 0, 2]:
    try:
        print(100 / d)
    except ZeroDivisionError:
        print("на ноль нельзя, пропускаю")`}),
    P(String.raw`Лучше писать в ‹except› конкретный тип ошибки, а не «любую»: иначе спрячешь настоящую проблему. Блок ‹else› выполнится, если ошибки не было, ‹finally› — в любом случае, а ‹raise› бросает свою ошибку.`),
    C(String.raw`
def safe_div(a, b):
    if b == 0:
        raise ValueError("на ноль делить нельзя")
    return a / b

try:
    print(safe_div(10, 2))
    print(safe_div(1, 0))
except ValueError as e:
    print("Ошибка:", e)
finally:
    print("Это выполнится всегда")`),
    W(String.raw`Не пиши голый ‹except:› или ‹except Exception:› без причины. Он проглотит даже опечатку в имени переменной, и ты потратишь час, не понимая, почему «ничего не работает».`),
    S('Повторять, пока не введут правильно'),
    P(String.raw`Классика: просим ввести число, а пользователь вводит ерунду. Решение — цикл с ‹try›.`),
    C(String.raw`
while True:
    raw = input("Введи число: ")
    try:
        n = int(raw)
        break
    except ValueError:
        print("Это не число, ещё раз.")
print("Спасибо, ты ввёл", n)`, {stdin:"abc\n\n42"}),
    Q(String.raw`Какая ошибка будет у ‹int("3.5")›?`, ['TypeError', 'ValueError', 'SyntaxError', 'Никакой, вернёт 3'], 1, String.raw`Тип ‹str› подходит (строку можно передать в ‹int›), а вот значение — нет, это не целое число. Поэтому ‹ValueError›.`),

    T({id:'err-safe',
      text:'Напиши ‹safe_int(text, default=0)›: пробует превратить строку в целое число, а если не вышло — возвращает ‹default›.',
      starter:String.raw`
def safe_int(text, default=0):
    pass`,
      hint:'Внутри функции: ‹try› с ‹return int(text)› и ‹except ValueError›.',
      test:String.raw`
assert safe_int("42") == 42, 'safe_int("42") должна вернуть 42'
assert safe_int("abc") == 0, 'safe_int("abc") должна вернуть 0'
assert safe_int("x", -1) == -1, 'safe_int("x", -1) должна вернуть -1'
assert safe_int("") == 0, 'пустая строка тоже не число'`,
      solution:String.raw`
def safe_int(text, default=0):
    try:
        return int(text)
    except ValueError:
        return default`}),
    T({id:'err-div',
      text:'Напиши ‹divide(a, b)›: возвращает ‹a / b›, а если ‹b› равно нулю — строку ‹"нельзя делить на ноль"› (не падает с ошибкой).',
      starter:String.raw`
def divide(a, b):
    pass`,
      hint:'Либо проверь ‹if b == 0›, либо оберни деление в ‹try› / ‹except ZeroDivisionError›.',
      test:String.raw`
assert divide(10, 4) == 2.5, "divide(10, 4) должна вернуть 2.5"
assert divide(1, 0) == "нельзя делить на ноль", "для b = 0 нужна строка про ноль"
assert divide(0, 5) == 0`,
      solution:String.raw`
def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "нельзя делить на ноль"`}),
    T({id:'err-age',
      text:'Напиши ‹parse_age(text)›: превращает строку в возраст. Если это не целое число, или оно меньше 0 или больше 120 — **бросает** ‹ValueError› с любым текстом (через ‹raise›). Иначе возвращает число.',
      starter:String.raw`
def parse_age(text):
    pass`,
      hint:'‹age = int(text)› сам бросит ‹ValueError› для «abc». Осталось проверить диапазон и сделать ‹raise ValueError("…")›.',
      test:String.raw`
assert parse_age("25") == 25
assert parse_age("0") == 0
for bad in ["abc", "-1", "121", "", "3.5"]:
    try:
        parse_age(bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"parse_age({bad!r}) должна бросить ValueError")`,
      solution:String.raw`
def parse_age(text):
    age = int(text)
    if age < 0 or age > 120:
        raise ValueError("возраст вне диапазона")
    return age`}),
    T({id:'err-first', star:true,
      text:'Напиши ‹first_int(items)›: идёт по списку строк и возвращает **первое** значение, которое можно превратить в целое число (уже как ‹int›). Если таких нет — ‹None›.',
      starter:String.raw`
def first_int(items):
    pass`,
      hint:'Цикл по ‹items›; внутри ‹try›: ‹return int(x)›; в ‹except ValueError› ничего не делаем (‹continue›). После цикла — ‹return None›.',
      test:String.raw`
assert first_int(["a", "b", "7", "9"]) == 7, 'для ["a", "b", "7", "9"] нужно 7'
assert first_int(["x", "y"]) is None, "если чисел нет — None"
assert first_int([]) is None
assert first_int(["12"]) == 12 and isinstance(first_int(["12"]), int)`,
      solution:String.raw`
def first_int(items):
    for x in items:
        try:
            return int(x)
        except ValueError:
            continue
    return None`}),
  ]
});

COURSE.add('trainee', {
  id:'files', title:'Файлы и модули', blurb:'Сохранять данные и брать готовые инструменты.',
  lead:'Сохраняем данные на диск и подключаем готовые библиотеки.',
  blocks:[
    S('Файлы'),
    P(String.raw`Программа забывает всё, когда закрывается. Чтобы данные жили дольше, их пишут в файлы. Открывать правильно через ‹with›: он сам закроет файл. Режимы: ‹"w"› — запись (стирает старое), ‹"a"› — дописать, ‹"r"› — чтение. Кодировку лучше указывать явно.`),
    C(String.raw`
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("первая строка\n")
    f.write("вторая строка\n")

with open("notes.txt", "r", encoding="utf-8") as f:
    text = f.read()
print(text)

with open("notes.txt", encoding="utf-8") as f:
    for line in f:
        print(line.strip())`),
    N(String.raw`На этой странице файлы живут во временной памяти браузера и пропадают при перезагрузке. На твоём компьютере тот же код создаст настоящий файл рядом со скриптом.`),
    E({say:String.raw`Файл — тетрадь. ‹open(..., "w")› — достать чистую тетрадь (старая запись стирается!). ‹open(..., "a")› — открыть на последней странице и дописать. ‹open(..., "r")› — читать. ‹with› — это правило хорошего тона: после работы тетрадь сама закрывается и кладётся на место, даже если по дороге случилась ошибка.`,
      title:'Другая тетрадь: дневник',
      code:String.raw`
with open("diary.txt", "w", encoding="utf-8") as f:
    f.write("Пн: выучил циклы\n")
with open("diary.txt", "a", encoding="utf-8") as f:   # дописываем
    f.write("Вт: выучил функции\n")
with open("diary.txt", encoding="utf-8") as f:
    print(f.read())`}),
    W(String.raw`Режим ‹"w"› **стирает** файл при открытии. Хотел дописать — бери ‹"a"›. И сразу укажи ‹encoding="utf-8"›, иначе русский текст на некоторых компьютерах превратится в кракозябры.`),

    S('Модули'),
    P(String.raw`**Модули** — готовые наборы функций. Подключаются через ‹import›. В комплекте с Python уже много полезного: ‹math›, ‹random›, ‹datetime›, ‹json›.`),
    C(String.raw`
import math
import random
from datetime import date

print(math.sqrt(144))
print(math.pi)
print(random.choice(["камень", "ножницы", "бумага"]))
print(random.randint(1, 6))   # бросок кубика
print(date(2026, 12, 24).strftime("%d.%m.%Y"))`),
    E({say:String.raw`Модуль — соседняя мастерская с инструментами. Ты не строишь молоток с нуля, а говоришь «возьму молоток у соседа» (‹import›). ‹import math› — взять весь ящик с инструментами, обращаться через точку: ‹math.sqrt›. ‹from math import sqrt› — взять один инструмент и положить себе в карман.`,
      title:'Другие инструменты',
      code:String.raw`
import math
from random import shuffle

print(math.ceil(4.1), math.floor(4.9))     # округление вверх и вниз
print(math.hypot(3, 4))                    # длина гипотенузы
cards = ["туз", "король", "дама", "валет"]
shuffle(cards)                             # перемешали на месте
print(cards)`}),
    S('JSON'),
    P(String.raw`JSON — формат, в котором данные путешествуют между программами и сайтами. Словари и списки превращаются в него и обратно двумя функциями: ‹dumps› (в текст) и ‹loads› (из текста). Для файлов есть пара ‹dump› и ‹load›.`),
    C(String.raw`
import json

user = {"name": "Коля", "skills": ["python", "git"]}
text = json.dumps(user, ensure_ascii=False)
print(text)

back = json.loads(text)
print(back["skills"][0])

with open("user.json", "w", encoding="utf-8") as f:
    json.dump(user, f, ensure_ascii=False, indent=2)
with open("user.json", encoding="utf-8") as f:
    print(json.load(f))`),
    P(String.raw`Сторонние библиотеки (‹requests›, ‹aiogram›, ‹flask›…) ставятся командой ‹pip install имя› в терминале на компьютере, где установлен Python с python.org. Здесь, в браузере, доступны только встроенные модули.`),
    Q(String.raw`Какой режим откроет файл, чтобы **дописать** в конец, не стирая старое?`, ['"r"', '"w"', '"a"', '"x"'], 2, String.raw`‹"a"› — append, дописывание. ‹"w"› стёр бы всё, а ‹"r"› только читает.`),

    T({id:'file-lines',
      text:'Напиши ‹read_lines(path)›: читает текстовый файл и возвращает список строк без символов переноса и без пустых строк.',
      starter:String.raw`
def read_lines(path):
    pass`,
      hint:'Открой файл через ‹with open(path, encoding="utf-8")›, пройди по строкам и оставь те, у которых ‹line.strip()› не пустой.',
      test:String.raw`
with open("t.txt", "w", encoding="utf-8") as f:
    f.write("a\n\nb\nпривет\n")
got = read_lines("t.txt")
assert got == ["a", "b", "привет"], f"получилось: {got}"`,
      solution:String.raw`
def read_lines(path):
    with open(path, encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]`}),
    T({id:'file-save',
      text:'Напиши ‹save_list(path, items)›: записывает каждый элемент списка в файл на отдельной строке. И ‹load_list(path)› — читает такой файл обратно и возвращает список строк.',
      starter:String.raw`
def save_list(path, items):
    pass

def load_list(path):
    pass`,
      hint:'Для записи: ‹f.write(item + "\\n")› в цикле. Для чтения: ‹f.read().splitlines()›.',
      test:String.raw`
save_list("l.txt", ["раз", "два", "три"])
assert load_list("l.txt") == ["раз", "два", "три"], f"получилось: {load_list('l.txt')}"
save_list("l.txt", ["новое"])
assert load_list("l.txt") == ["новое"], "второй вызов должен перезаписать файл"
save_list("l.txt", [])
assert load_list("l.txt") == [], "пустой список → пустой файл"`,
      solution:String.raw`
def save_list(path, items):
    with open(path, "w", encoding="utf-8") as f:
        for item in items:
            f.write(item + "\n")

def load_list(path):
    with open(path, encoding="utf-8") as f:
        return f.read().splitlines()`}),
    T({id:'file-json',
      text:'Напиши ‹save_json(path, data)› и ‹load_json(path)›: сохраняют и читают словарь/список в JSON-файле. Не забудь, что русский текст должен остаться читаемым (‹ensure_ascii=False›).',
      starter:String.raw`
import json

def save_json(path, data):
    pass

def load_json(path):
    pass`,
      hint:'‹json.dump(data, f, ensure_ascii=False)› и ‹json.load(f)›, оба внутри ‹with open(...)›.',
      test:String.raw`
data = {"имя": "Коля", "оценки": [5, 4, 5], "ok": True}
save_json("d.json", data)
assert load_json("d.json") == data, "после сохранения и чтения данные должны совпасть"
with open("d.json", encoding="utf-8") as f:
    raw = f.read()
assert "Коля" in raw, "русский текст должен быть читаемым в файле (ensure_ascii=False)"`,
      solution:String.raw`
import json

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)

def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)`}),
    T({id:'file-days',
      text:'Напиши ‹days_until(y, m, d, today_y, today_m, today_d)›: сколько дней от «сегодня» до даты (положительное число, если дата в будущем). Используй ‹datetime.date›: разность двух дат — это ‹timedelta›, у которого есть ‹.days›.',
      starter:String.raw`
from datetime import date

def days_until(y, m, d, today_y, today_m, today_d):
    pass`,
      hint:'‹(date(y, m, d) - date(today_y, today_m, today_d)).days›.',
      test:String.raw`
assert days_until(2026, 12, 24, 2026, 12, 1) == 23
assert days_until(2027, 1, 1, 2026, 12, 31) == 1
assert days_until(2026, 1, 1, 2026, 1, 11) == -10
assert days_until(2028, 3, 1, 2028, 2, 28) == 2, "2028 високосный"`,
      solution:String.raw`
from datetime import date

def days_until(y, m, d, today_y, today_m, today_d):
    return (date(y, m, d) - date(today_y, today_m, today_d)).days`, star:true}),
  ]
});

COURSE.add('trainee', {
  id:'game', title:'Мини-проект: угадай число', blurb:'Первая игра: функции, циклы, ввод и random.',
  lead:'Компьютер загадывает число, ты угадываешь. Собираем игру по кусочкам и проверяем каждый.',
  blocks:[
    S('План'),
    P(String.raw`Большую программу не пишут «сверху вниз за один присест». Её делят на кусочки-функции, проверяют каждый отдельно, а потом склеивают. Наша игра состоит из трёх частей:`),
    L([
      '**Загадать число** — это ‹random.randint(1, 100)›.',
      '**Сравнить** догадку с загаданным — функция ‹check(secret, guess)›.',
      '**Крутить игру** — цикл, который спрашивает число, пока не угадают.',
    ]),
    N(String.raw`Так делают в любом проекте: сначала маленькие проверяемые функции, потом «клей» из них. Ошибку в маленькой функции найти в 10 раз проще, чем в простыне на 200 строк.`),
    S('Готовая игра, чтобы понять идею'),
    C(String.raw`
secret = 13        # в настоящей игре тут random.randint(1, 20)
attempts = 0
while True:
    guess = int(input("Твой вариант (1-20): "))
    attempts += 1
    if guess < secret:
        print("Больше")
    elif guess > secret:
        print("Меньше")
    else:
        print(f"Угадал за {attempts} попыток!")
        break`, {stdin:"10\n15\n12\n13"}),
    P(String.raw`Для примера число зашито (13), чтобы можно было пройти игру по подсказкам в поле «ответы». В настоящей игре его загадывает ‹random.randint(1, 20)›, и угадать заранее нельзя. А теперь разобьём игру на части.`),
    HOW('Как устроен цикл игры', [
      'Загадываем число ОДИН раз, до цикла. Иначе оно менялось бы на каждом круге.',
      '‹while True› — бесконечный цикл. Выйти из него можно только через ‹break›.',
      'Каждый круг: спрашиваем число, увеличиваем счётчик попыток, сравниваем.',
      'Если угадал — печатаем итог и ‹break›. Если нет — подсказка, и круг начинается заново.'
    ]),
    T({id:'game-check',
      text:'Напиши ‹check(secret, guess)›: возвращает ‹"больше"›, если загаданное число больше догадки, ‹"меньше"›, если меньше, и ‹"угадал"›, если равно.',
      starter:String.raw`
def check(secret, guess):
    pass`,
      hint:'Три ветки: ‹if guess < secret›, ‹elif guess > secret›, ‹else›. Не путай, кто из них больше!',
      test:String.raw`
assert check(50, 30) == "больше", "загадано 50, догадка 30: загаданное БОЛЬШЕ"
assert check(50, 80) == "меньше", "загадано 50, догадка 80: загаданное МЕНЬШЕ"
assert check(7, 7) == "угадал"`,
      solution:String.raw`
def check(secret, guess):
    if guess < secret:
        return "больше"
    elif guess > secret:
        return "меньше"
    return "угадал"`}),
    T({id:'game-attempts',
      text:'Напиши ‹play(secret, guesses)›: имитация игры без ввода. ‹guesses› — список догадок игрока по порядку. Функция возвращает, **с какой по счёту попытки** угадано число (1, 2, …), а если ни одна не подошла — ‹None›.',
      starter:String.raw`
def play(secret, guesses):
    pass`,
      hint:'‹for i, g in enumerate(guesses, start=1)›: если ‹g == secret› — ‹return i›. После цикла — ‹return None›.',
      test:String.raw`
assert play(10, [5, 15, 10, 3]) == 3, "десятка на третьем месте"
assert play(7, [7]) == 1
assert play(7, [1, 2, 3]) is None
assert play(7, []) is None`,
      solution:String.raw`
def play(secret, guesses):
    for i, g in enumerate(guesses, start=1):
        if g == secret:
            return i
    return None`}),
    T({id:'game-temp',
      text:'Режим «горячо-холодно»: напиши ‹temperature(secret, guess)›. Если разница по модулю 0 — ‹"угадал"›, до 3 включительно — ‹"горячо"›, до 10 включительно — ‹"тепло"›, иначе ‹"холодно"›. Модуль числа — ‹abs()›.',
      starter:String.raw`
def temperature(secret, guess):
    pass`,
      hint:'Сначала ‹diff = abs(secret - guess)›, потом цепочка ‹if› / ‹elif› от меньшего порога к большему.',
      test:String.raw`
cases = [((50, 50), "угадал"), ((50, 53), "горячо"), ((50, 47), "горячо"), ((50, 60), "тепло"),
         ((50, 40), "тепло"), ((50, 61), "холодно"), ((50, 1), "холодно")]
for args, want in cases:
    assert temperature(*args) == want, f"temperature{args} должна вернуть {want!r}, а у тебя {temperature(*args)!r}"`,
      solution:String.raw`
def temperature(secret, guess):
    diff = abs(secret - guess)
    if diff == 0:
        return "угадал"
    elif diff <= 3:
        return "горячо"
    elif diff <= 10:
        return "тепло"
    return "холодно"`}),
    T({id:'game-full', free:true, star:true,
      text:'Собери настоящую игру! Загадай число функцией ‹random.randint›, в цикле спрашивай догадки через ‹input()›, подсказывай ‹check›-ом «больше / меньше», считай попытки и сообщи итог. Ограничь число попыток (например, 7). Можешь добавить своё: уровни сложности, рекорд, «играть ещё раз?». Ответы подставлены в поле под кодом.',
      starter:String.raw`
import random

def check(secret, guess):
    if guess < secret:
        return "больше"
    elif guess > secret:
        return "меньше"
    return "угадал"

secret = random.randint(1, 100)
# дальше твой цикл`,
      solution:String.raw`
import random

def check(secret, guess):
    if guess < secret:
        return "больше"
    elif guess > secret:
        return "меньше"
    return "угадал"

secret = random.randint(1, 100)
max_attempts = 7
for attempt in range(1, max_attempts + 1):
    guess = int(input(f"Попытка {attempt}/{max_attempts}: "))
    hint = check(secret, guess)
    if hint == "угадал":
        print(f"Ура, угадал за {attempt}!")
        break
    print("Загаданное", hint)
else:
    print("Попытки кончились, было число", secret)`,
      stdin:"50\n25\n75\n12\n88\n6\n99"}),
  ]
});

COURSE.add('trainee', {
  id:'project', title:'Мини-проект: расходы', blurb:'Собираем всё вместе в одну программу.',
  lead:'Собираем всё вместе: учёт расходов на списках, словарях и функциях.',
  blocks:[
    S('Как устроена программа'),
    P(String.raw`Данные — список словарей, логика — функции. Запусти пример и поменяй суммы.`),
    C(String.raw`
expenses = []

def add_expense(title, amount, category):
    expenses.append({"title": title, "amount": amount, "category": category})

def total(items):
    result = 0
    for e in items:
        result += e["amount"]
    return result

add_expense("Проездной", 49, "транспорт")
add_expense("Обед в мензе", 3.5, "еда")
add_expense("Steam", 19.99, "игры")
add_expense("Ужин", 7.5, "еда")

print("Всего потрачено:", round(total(expenses), 2), "€")`),
    N(String.raw`Заметь: функции не печатают, а **возвращают** результат. Поэтому одну и ту же ‹total› можно использовать и для всех расходов, и для расходов по одной категории.`),
    S('Дописываем программу'),
    P(String.raw`Дальше четыре задачи. Каждая — ещё одна функция для этого учёта. В конце у тебя будет мини-приложение, которое можно показать в портфолио.`),
    T({id:'proj-summary',
      text:'Допиши ‹summary(items)›: возвращает словарь «категория → сумма расходов в ней», суммы округлены до двух знаков. Для данных ниже получится ‹{\'транспорт\': 49, \'еда\': 11.0, \'игры\': 19.99}›.',
      starter:String.raw`
expenses = [
    {"title": "Проездной", "amount": 49, "category": "транспорт"},
    {"title": "Обед в мензе", "amount": 3.5, "category": "еда"},
    {"title": "Steam", "amount": 19.99, "category": "игры"},
    {"title": "Ужин", "amount": 7.5, "category": "еда"},
]

def summary(items):
    result = {}
    # твой код
    return result

print(summary(expenses))`,
      hint:'Тот же приём, что и в задаче про слова: ‹result[cat] = result.get(cat, 0) + сумма›. Округлить можно в конце, отдельным циклом.',
      test:String.raw`
data = [
    {"title": "a", "amount": 49, "category": "транспорт"},
    {"title": "b", "amount": 3.5, "category": "еда"},
    {"title": "c", "amount": 19.99, "category": "игры"},
    {"title": "d", "amount": 7.5, "category": "еда"},
]
got = summary(data)
assert got == {"транспорт": 49, "еда": 11.0, "игры": 19.99}, f"получилось: {got}"
assert summary([]) == {}, "для пустого списка нужен пустой словарь"`,
      solution:String.raw`
def summary(items):
    result = {}
    for e in items:
        cat = e["category"]
        result[cat] = result.get(cat, 0) + e["amount"]
    for cat in result:
        result[cat] = round(result[cat], 2)
    return result`}),
    T({id:'proj-top',
      text:'Напиши ‹top_category(items)›: возвращает **название категории**, на которую потрачено больше всего. Если расходов нет — ‹None›. Можешь использовать свою ‹summary›, скопировав её сюда.',
      starter:String.raw`
def summary(items):
    result = {}
    for e in items:
        result[e["category"]] = result.get(e["category"], 0) + e["amount"]
    return result

def top_category(items):
    pass`,
      hint:'Получи ‹sums = summary(items)›. Если пусто — ‹None›. Иначе ‹max(sums, key=sums.get)›.',
      test:String.raw`
data = [
    {"title": "a", "amount": 49, "category": "транспорт"},
    {"title": "b", "amount": 3.5, "category": "еда"},
    {"title": "c", "amount": 19.99, "category": "игры"},
    {"title": "d", "amount": 70, "category": "еда"},
]
assert top_category(data) == "еда", f"получилось: {top_category(data)!r}"
assert top_category([]) is None, "для пустого списка нужен None"`,
      solution:String.raw`
def summary(items):
    result = {}
    for e in items:
        result[e["category"]] = result.get(e["category"], 0) + e["amount"]
    return result

def top_category(items):
    sums = summary(items)
    if not sums:
        return None
    return max(sums, key=sums.get)`}),
    T({id:'proj-filter',
      text:'Напиши ‹big_expenses(items, limit)›: возвращает список **названий** (‹title›) расходов, сумма которых строго больше ‹limit›, отсортированный по алфавиту.',
      starter:String.raw`
def big_expenses(items, limit):
    pass`,
      hint:'Генератор списка с условием по ‹e["amount"]›, а затем ‹sorted(...)›.',
      test:String.raw`
data = [
    {"title": "Ужин", "amount": 7.5, "category": "еда"},
    {"title": "Проездной", "amount": 49, "category": "транспорт"},
    {"title": "Steam", "amount": 19.99, "category": "игры"},
    {"title": "Кофе", "amount": 3, "category": "еда"},
]
assert big_expenses(data, 10) == ["Steam", "Проездной"], f"получилось: {big_expenses(data, 10)}"
assert big_expenses(data, 49) == [], "строго больше: 49 не проходит"
assert big_expenses([], 0) == []`,
      solution:String.raw`
def big_expenses(items, limit):
    return sorted(e["title"] for e in items if e["amount"] > limit)`}),
    T({id:'proj-report', star:true,
      text:'Собери итоговый отчёт: ‹report(items)› возвращает **строку** из строк вида ‹еда: 11.00 €›, по одной на категорию, отсортированных по категории, разделённых переводом строки, а последней строкой ‹Итого: 79.99 €›. Суммы всегда с двумя знаками.',
      starter:String.raw`
def report(items):
    pass`,
      hint:'Сначала суммы по категориям (как в ‹summary›), потом пройди по ‹sorted(sums)› и собери список строк через f-строку с ‹:.2f›. В конец добавь строку «Итого». Склей через ‹"\\n".join(...)›.',
      test:String.raw`
data = [
    {"title": "a", "amount": 49, "category": "транспорт"},
    {"title": "b", "amount": 3.5, "category": "еда"},
    {"title": "c", "amount": 19.99, "category": "игры"},
    {"title": "d", "amount": 7.5, "category": "еда"},
]
want = "еда: 11.00 €\nигры: 19.99 €\nтранспорт: 49.00 €\nИтого: 79.99 €"
got = report(data)
assert got == want, f"получилось:\n{got}\n\nнужно:\n{want}"
assert report([]) == "Итого: 0.00 €", f"для пустого списка нужно 'Итого: 0.00 €', а у тебя {report([])!r}"`,
      solution:String.raw`
def report(items):
    sums = {}
    for e in items:
        sums[e["category"]] = sums.get(e["category"], 0) + e["amount"]
    lines = [f"{cat}: {sums[cat]:.2f} €" for cat in sorted(sums)]
    lines.append(f"Итого: {sum(sums.values()):.2f} €")
    return "\n".join(lines)`}),
    S('Что дальше'),
    P(String.raw`Курс стажёра пройден — база у тебя есть. Дальше выбирай то, что хочется делать на самом деле:`),
    P(String.raw`**Уровень «Джун».** Классы и ООП, генераторы, декораторы, тесты, чистый код. Это то, что спрашивают на первом собеседовании.`),
    P(String.raw`**Telegram-бот.** Поставь Python на компьютер, затем ‹pip install aiogram›. Первый бот пишется за вечер.`),
    P(String.raw`**Данные из интернета.** Библиотека ‹requests› и любой открытый API: погода, курсы валют, цены в играх.`),
    P(String.raw`**Сайт.** ‹Flask› или ‹FastAPI›: твои функции начинают отвечать на запросы из браузера.`),
    P(String.raw`**Git и GitHub.** Выкладывай всё, что написал: это сразу превращается в портфолио.`),
  ]
});
