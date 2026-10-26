/* Стажёр, часть 2: циклы, списки, словари, кортежи и множества */

COURSE.add('trainee', {
  id:'loops', title:'Циклы', blurb:'for, while, break — повторять без копипаста.',
  lead:'Как заставить Python повторять действия, а не копировать код.',
  blocks:[
    S('Зачем нужны циклы'),
    P(String.raw`Представь, что надо вывести числа от 1 до 1000. Писать ‹print› тысячу раз глупо. Цикл говорит Python: «повтори это столько-то раз» — а ты пишешь код один раз.`),
    S('for: пройти по набору'),
    P(String.raw`‹for› проходит по набору значений, а ‹range(5)› выдаёт числа 0, 1, 2, 3, 4 — пять штук, начиная с нуля. На каждом круге переменная ‹i› получает следующее значение.`),
    C(String.raw`
for i in range(5):
    print("Круг", i)`),
    E({say:[
        String.raw`Ты раздаёшь открытки одноклассникам. Берёшь первую, подписываешь, откладываешь. Берёшь вторую... Пока открытки не кончатся. ‹for› — это такой раздатчик: каждый круг достаёт следующую вещь, называет её ‹i› и выполняет всё, что написано с отступом.`,
        String.raw`Отступ тут тоже важен: всё, что с отступом, повторяется. То, что без отступа, выполнится один раз после цикла.`],
      title:'Тот же цикл, другие данные',
      code:String.raw`
for day in ["пн", "вт", "ср"]:
    print("Сегодня", day)
print("Цикл закончился (это строка без отступа)")`}),
    HOW('Что происходит внутри for i in range(3)', [
      '‹range(3)› готовит числа 0, 1, 2.',
      'Круг 1: ‹i› становится 0, выполняется тело цикла (всё с отступом).',
      'Круг 2: ‹i› становится 1, тело выполняется снова.',
      'Круг 3: ‹i› становится 2, тело выполняется ещё раз.',
      'Числа кончились — Python выходит из цикла и идёт к следующей строке без отступа.'
    ], String.raw`
for i in range(3):
    print("i =", i)
print("конец")`),
    P(String.raw`‹range(1, 6)› — от 1 до 5 (правая граница не входит). Третий аргумент — шаг, он может быть отрицательным.`),
    C(String.raw`
for n in range(1, 6):
    print(n, "в квадрате =", n ** 2)

print("---")
for n in range(10, 0, -3):
    print(n)`),
    P(String.raw`Строку тоже можно перебирать — по буквам:`),
    C(String.raw`
for letter in "Python":
    print(letter)`),

    S('Накопитель: самый частый приём'),
    P(String.raw`Заводишь переменную до цикла и на каждом круге её обновляешь. Так считают суммы, количества, произведения.`),
    C(String.raw`
total = 0
for n in range(1, 6):
    total += n          # то же, что total = total + n
print("Сумма 1..5 =", total)`),
    E({say:String.raw`Копилка. Перед циклом она пуста (‹total = 0›). На каждом круге ты кидаешь в неё монетку (‹total += n›). После цикла открываешь копилку и смотришь итог. Главное — завести копилку до цикла: если создать её внутри, она будет обнуляться на каждом круге.`,
      title:'Копилка с другими числами: считаем, сколько всего яиц',
      code:String.raw`
eggs_per_day = [3, 5, 2, 4, 6]
total_eggs = 0
for e in eggs_per_day:
    total_eggs += e
print("Всего яиц:", total_eggs)`}),
    W(String.raw`Классическая ошибка — поставить ‹total = 0› внутрь цикла. Тогда на каждом круге копилка опустошается, и в конце останется только последняя монетка.`),

    S('while: пока условие верно'),
    P(String.raw`‹while› крутится, пока условие верно. Следи, чтобы оно когда-нибудь стало ложным, иначе получится бесконечный цикл. Страница сама остановит такой код через 8 секунд.`),
    C(String.raw`
count = 3
while count > 0:
    print("Осталось", count)
    count -= 1      # то же, что count = count - 1
print("Пуск!")`),
    P(String.raw`Когда использовать что? ‹for› — когда знаешь, **сколько раз** или **по чему** идти. ‹while› — когда повторяешь, **пока** не случится что-то: пользователь ввёл верный пароль, число стало меньше 10.`),
    C(String.raw`
n = 100
steps = 0
while n > 1:
    n = n // 2
    steps += 1
print("Сколько раз можно поделить 100 пополам, пока не станет 1:", steps)`),
    Q(String.raw`Сколько раз выведется «Привет»?

‹for i in range(3):›
‹    print("Привет")›`, ['2', '3', '4', 'Бесконечно'], 1, String.raw`‹range(3)› даёт 0, 1, 2 — три значения, значит три круга.`),

    S('break и continue'),
    P(String.raw`‹break› выходит из цикла сразу, ‹continue› пропускает остаток круга и идёт к следующему.`),
    C(String.raw`
for n in range(1, 20):
    if n % 2 == 0:
        continue      # чётные пропускаем
    if n > 9:
        break         # дошли до 11 — хватит
    print(n)`),
    S('Цикл в цикле'),
    P(String.raw`Внутрь одного цикла можно вложить другой. Внутренний пройдёт полный круг на каждом шаге внешнего. Так получаются таблицы.`),
    C(String.raw`
for row in range(1, 4):
    line = ""
    for col in range(1, 4):
        line += str(row * col) + " "
    print(line)`),

    T({id:'loops-sum',
      text:'Посчитай в ‹total› сумму квадратов чисел от 1 до 10 (1 + 4 + 9 + …). Используй цикл.',
      starter:String.raw`
total = 0
# твой цикл ниже`,
      hint:'В каждом круге прибавляй ‹n ** 2› к ‹total›.',
      test:String.raw`assert total == 385, f"total сейчас {total}, а нужно 385"`,
      solution:String.raw`
total = 0
for n in range(1, 11):
    total += n ** 2`}),
    T({id:'loops-fact',
      text:'Факториал числа — произведение всех чисел от 1 до него (5! = 1·2·3·4·5 = 120). Посчитай в ‹fact› факториал числа ‹n›. Проверка подставит другое ‹n›.',
      starter:String.raw`
n = 5
fact = 1`,
      hint:'Копилка тут умножающая, поэтому она стартует с 1, а не с 0. В цикле: ‹fact *= i› для ‹i› от 1 до ‹n› включительно.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("n ="))
for n, want in [(5, 120), (1, 1), (0, 1), (7, 5040)]:
    g = {"n": n}; exec(body, g)
    assert g["fact"] == want, f"для n = {n} нужно {want}, а у тебя {g['fact']}"`,
      solution:String.raw`
n = 5
fact = 1
for i in range(1, n + 1):
    fact *= i`}),
    T({id:'loops-seven',
      text:'Посчитай в ‹count›, сколько чисел от 1 до 100 включительно делятся на 7 без остатка.',
      starter:String.raw`
count = 0`,
      hint:'Цикл по ‹range(1, 101)›, внутри ‹if n % 7 == 0›: увеличиваем ‹count›.',
      test:String.raw`assert count == 14, f"count сейчас {count}, а нужно 14"`,
      solution:String.raw`
count = 0
for n in range(1, 101):
    if n % 7 == 0:
        count += 1`}),
    T({id:'loops-digits',
      text:'Посчитай в ‹s› сумму цифр числа ‹num› (для 1234 это 1+2+3+4 = 10). Используй ‹while›: отщипывай последнюю цифру через ‹% 10›, а потом убирай её через ‹// 10›. Проверка подставит другие числа.',
      starter:String.raw`
num = 1234
s = 0`,
      hint:'Пока ‹num› больше нуля: прибавь ‹num % 10› к ‹s›, потом ‹num = num // 10›. Если менять ‹num› внутри, изначальное значение пропадёт, это нормально.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("num ="))
for num, want in [(1234, 10), (7, 7), (1000, 1), (98765, 35)]:
    g = {"num": num}; exec(body, g)
    assert g["s"] == want, f"для {num} нужно {want}, а у тебя {g['s']}"`,
      solution:String.raw`
num = 1234
s = 0
while num > 0:
    s += num % 10
    num //= 10`}),
    T({id:'loops-stairs',
      text:'Построй в ‹stairs› строку-лесенку из ‹n› рядов. Для ‹n = 3› это ‹"*\\n**\\n***\\n"› (каждый ряд заканчивается переводом строки). Проверка подставит другое ‹n›.',
      starter:String.raw`
n = 3
stairs = ""`,
      hint:'В цикле ‹for i in range(1, n + 1)› добавляй к ‹stairs› строку ‹"*" * i + "\\n"›.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("n ="))
for n, want in [(3, "*\n**\n***\n"), (1, "*\n"), (5, "*\n**\n***\n****\n*****\n")]:
    g = {"n": n}; exec(body, g)
    assert g["stairs"] == want, f"для n = {n} нужно {want!r}, а у тебя {g['stairs']!r}"`,
      solution:String.raw`
n = 3
stairs = ""
for i in range(1, n + 1):
    stairs += "*" * i + "\n"`}),
    T({id:'loops-collatz', star:true,
      text:'Задача Коллатца: берём число ‹n›. Если оно чётное — делим на 2, если нечётное — умножаем на 3 и прибавляем 1. Повторяем, пока не получим 1. Запиши в ‹steps›, сколько шагов понадобилось (для 6: 6→3→10→5→16→8→4→2→1, это 8 шагов).',
      starter:String.raw`
n = 6
steps = 0`,
      hint:'‹while n != 1›: внутри ‹if n % 2 == 0› делим (‹n //= 2›), иначе ‹n = n * 3 + 1›. И каждый круг увеличиваем ‹steps›.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("n ="))
for n, want in [(6, 8), (1, 0), (27, 111), (7, 16)]:
    g = {"n": n}; exec(body, g)
    assert g["steps"] == want, f"для n = {n} нужно {want} шагов, а у тебя {g['steps']}"`,
      solution:String.raw`
n = 6
steps = 0
while n != 1:
    if n % 2 == 0:
        n //= 2
    else:
        n = n * 3 + 1
    steps += 1`}),
  ]
});

COURSE.add('trainee', {
  id:'lists', title:'Списки', blurb:'Много значений в одной переменной.',
  lead:'Хранить много значений сразу и обрабатывать их все одним циклом.',
  blocks:[
    S('Что такое список'),
    P(String.raw`Список — упорядоченный набор значений в квадратных скобках. Хранить в нём можно что угодно и сколько угодно.`),
    C(String.raw`
games = ["Minecraft", "CS2", "Dota 2"]
print(games)
print(len(games))   # сколько элементов`),
    E({say:String.raw`Список — полка с пронумерованными ячейками. В каждой ячейке лежит по одной вещи. Номера идут с нуля: нулевая ячейка — самая левая. Можно достать вещь по номеру, положить новую в конец или переставить всё в другом порядке.`,
      title:'Другая полка',
      code:String.raw`
fruits = ["яблоко", "груша", "слива"]
print(fruits)
print("На полке", len(fruits), "штуки")
print("Первое:", fruits[0])`}),
    S('Индексы и срезы'),
    P(String.raw`Элементы нумеруются **с нуля**. Отрицательный индекс считает с конца. Срез ‹[a:b]› берёт элементы от a до b (b не входит).`),
    C(String.raw`
games = ["Minecraft", "CS2", "Dota 2", "Factorio", "Terraria"]
print(games[0])     # первый
print(games[-1])    # последний
print(games[1:3])   # ['CS2', 'Dota 2']
print(games[:2])    # первые два`),
    W(String.raw`‹games[5]› при пяти элементах — это ‹IndexError›: последний индекс равен ‹len(games) - 1›, то есть 4.`),

    S('Меняем список'),
    P(String.raw`Список можно менять: ‹append› добавляет в конец, ‹insert› вставляет на нужное место, ‹remove› убирает по значению, ‹pop› достаёт по номеру, ‹sort()› сортирует, ‹in› проверяет, есть ли элемент.`),
    C(String.raw`
todo = ["учить Python"]
todo.append("сделать бота")
todo.append("выложить на GitHub")
todo.remove("сделать бота")
print(todo)
print("учить Python" in todo)

nums = [5, 2, 9, 1]
nums.sort()
print(nums)
nums[0] = 100        # заменить элемент по индексу
last = nums.pop()    # достать и убрать последний
print(nums, last)`),
    TB(['Что нужно', 'Как'], [
      ['добавить в конец', '‹a.append(x)›'],
      ['вставить на место i', '‹a.insert(i, x)›'],
      ['удалить по значению', '‹a.remove(x)›'],
      ['достать по номеру (по умолчанию последний)', '‹a.pop(i)›'],
      ['сортировать на месте', '‹a.sort()› или ‹a.sort(reverse=True)›'],
      ['развернуть', '‹a.reverse()›'],
      ['сколько раз встретилось', '‹a.count(x)›'],
      ['сумма / мин / макс / длина', '‹sum(a)›, ‹min(a)›, ‹max(a)›, ‹len(a)›'],
      ['новый отсортированный, старый не трогать', '‹sorted(a)›'],
    ]),
    E({say:String.raw`‹append› — положить вещь в конец полки. ‹remove› — найти такую вещь и выкинуть. ‹sort()› — расставить по порядку. Эти действия **меняют сам список**, поэтому ничего не возвращают (если напишешь ‹x = a.sort()›, то в ‹x› окажется ‹None›). А ‹sorted(a)› — выдаёт новую расставленную копию, старый список остаётся нетронутым.`,
      title:'Другая очередь: игроки и очки',
      code:String.raw`
scores = [40, 15, 90]
scores.append(60)
print(scores)
print(sorted(scores))           # копия, оригинал цел
print(scores)
scores.sort(reverse=True)       # на месте, по убыванию
print(scores, "лучший:", max(scores), "сумма:", sum(scores))`}),
    W(String.raw`Присваивание списка **не копирует его**: ‹b = a› — это две наклейки на одной коробке. Измени через ‹b› — изменится и ‹a›. Хочешь копию — ‹b = a.copy()› или ‹b = a[:]›.`),
    C(String.raw`
a = [1, 2, 3]
b = a            # та же самая коробка
b.append(99)
print(a)         # [1, 2, 3, 99]

c = a.copy()     # настоящая копия
c.append(0)
print(a, c)`),

    S('Перебор списка'),
    P(String.raw`Обходится список тем же ‹for›. Нужен ещё и номер? Используй ‹enumerate›.`),
    C(String.raw`
games = ["Minecraft", "CS2", "Dota 2"]
for g in games:
    print("Играю в", g)

for i, g in enumerate(games, start=1):
    print(f"{i}. {g}")`),
    S('Генератор списка'),
    P(String.raw`Собрать новый список из старого одной строкой помогает **генератор списка**: «для каждого ‹n› из ‹nums› возьми ‹n ** 2›, но только если…»`),
    C(String.raw`
nums = [1, 2, 3, 4, 5]
squares = [n ** 2 for n in nums]
odd = [n for n in nums if n % 2 == 1]
print(squares, odd)`),
    E({say:String.raw`Это конвейер на заводе: слева заезжают исходные детали, посередине стоит станок (‹n ** 2›), справа выезжают готовые. Фильтр ‹if› — контролёр, который отбраковывает некоторые детали. Длинная запись через ‹for› и ‹append› делает то же самое, просто медленнее для глаза.`,
      title:'Конвейер на других данных: названия игр заглавными, только короткие',
      code:String.raw`
games = ["cs2", "dota 2", "minecraft", "go"]
loud = [g.upper() for g in games]
short = [g for g in games if len(g) <= 3]
print(loud)
print(short)`}),
    S('Список списков'),
    P(String.raw`Внутри списка может лежать другой список. Так хранят таблицы: обращение через два индекса.`),
    C(String.raw`
table = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
print(table[1][2])        # строка 1, столбец 2 -> 6
for row in table:
    print(row, "сумма:", sum(row))`),
    Q(String.raw`Что лежит в ‹x› после ‹x = [10, 20, 30, 40][1:3]›?`, ['[10, 20]', '[20, 30]', '[20, 30, 40]', '[10, 20, 30]'], 1, String.raw`Срез ‹[1:3]› берёт элементы с индексами 1 и 2 (индекс 3 не входит): это 20 и 30.`),

    T({id:'lists-big',
      text:'Дан список ‹nums›. Положи в ‹big› только числа больше 10, в том же порядке.',
      starter:String.raw`
nums = [5, 12, 7, 20, 3, 18]
big = []`,
      hint:'Либо цикл с ‹if› и ‹append›, либо генератор: ‹[n for n in nums if …]›.',
      test:String.raw`assert big == [12, 20, 18], f"big сейчас {big}"`,
      solution:String.raw`
nums = [5, 12, 7, 20, 3, 18]
big = [n for n in nums if n > 10]`}),
    T({id:'lists-stats',
      text:'Для списка оценок ‹marks› запиши в ‹best› лучшую, в ‹worst› худшую и в ‹avg› среднюю оценку, округлённую до одного знака (‹round(x, 1)›).',
      starter:String.raw`
marks = [4, 5, 3, 5, 4]
best = 0
worst = 0
avg = 0`,
      hint:'Есть готовые ‹max›, ‹min›, ‹sum› и ‹len›. Среднее — это сумма, делённая на количество.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("marks ="))
g = {"marks": [2, 5, 4, 4]}; exec(body, g)
assert (g["best"], g["worst"], g["avg"]) == (5, 2, 3.8), f"для [2, 5, 4, 4] нужно (5, 2, 3.8), а у тебя {(g['best'], g['worst'], g['avg'])}"`,
      solution:String.raw`
marks = [4, 5, 3, 5, 4]
best = max(marks)
worst = min(marks)
avg = round(sum(marks) / len(marks), 1)`}),
    T({id:'lists-fb',
      text:'Классика собеседований. Собери список ‹fb› для чисел от 1 до 15. Если число делится на 3 — ‹"Fizz"›, на 5 — ‹"Buzz"›, на оба — ‹"FizzBuzz"›, иначе само число, но строкой: ‹"1"›, ‹"2"›, ‹"Fizz"›, ‹"4"›…',
      starter:String.raw`fb = []`,
      hint:'Сначала проверяй деление на 15 (оно значит «на оба»), потом на 3, потом на 5. Число в строку превращает ‹str(n)›.',
      test:String.raw`
want = ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']
assert fb == want, f"сейчас: {fb}"`,
      solution:String.raw`
fb = []
for n in range(1, 16):
    if n % 15 == 0:
        fb.append("FizzBuzz")
    elif n % 3 == 0:
        fb.append("Fizz")
    elif n % 5 == 0:
        fb.append("Buzz")
    else:
        fb.append(str(n))`}),
    T({id:'lists-uniq',
      text:'В списке ‹raw› есть повторы. Запиши в ‹uniq› те же значения без повторов, **сохранив порядок** первого появления. Проверка попробует другой список.',
      starter:String.raw`
raw = [3, 1, 3, 2, 1, 5]
uniq = []`,
      hint:'Иди по ‹raw›; если элемента ещё нет в ‹uniq› (проверка ‹not in›) — добавь его.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("raw ="))
g = {"raw": ["b", "a", "b", "c", "a"]}; exec(body, g)
assert g["uniq"] == ["b", "a", "c"], f"нужно ['b', 'a', 'c'], а у тебя {g['uniq']}"`,
      solution:String.raw`
raw = [3, 1, 3, 2, 1, 5]
uniq = []
for x in raw:
    if x not in uniq:
        uniq.append(x)`}),
    T({id:'lists-second', star:true,
      text:'Найди в ‹second› **второе по величине** число списка ‹nums› (без повторов: в ‹[5, 9, 9, 3]› второе — 5). Подумай, как избавиться от дубликатов, не теряя нужного.',
      starter:String.raw`
nums = [5, 9, 9, 3]
second = 0`,
      hint:'Превратим во множество, чтобы убрать повторы: ‹set(nums)›. Потом отсортируем и возьмём предпоследний: ‹sorted(set(nums))[-2]›.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("nums ="))
for nums, want in [([5, 9, 9, 3], 5), ([1, 2], 1), ([10, 8, 10, 7, 8], 8)]:
    g = {"nums": nums}; exec(body, g)
    assert g["second"] == want, f"для {nums} нужно {want}, а у тебя {g['second']}"`,
      solution:String.raw`
nums = [5, 9, 9, 3]
second = sorted(set(nums))[-2]`}),
  ]
});

COURSE.add('trainee', {
  id:'dicts', title:'Словари', blurb:'Данные по именам, как в анкете.',
  lead:'Пары «ключ → значение»: так выглядят пользователи, товары и ответы API.',
  blocks:[
    S('Словарь: ключ и значение'),
    P(String.raw`Словарь хранит пары «ключ → значение». Доступ не по номеру, а по имени, как в анкете.`),
    C(String.raw`
user = {"name": "Коля", "age": 20, "city": "Берлин"}
print(user["name"])
user["age"] = 21          # изменить
user["job"] = "студент"   # добавить новое
print(user)`),
    E({say:[
        String.raw`Телефонная книга. Ты не ищешь «третий номер по счёту» — ты ищешь «Маму». Имя (ключ) ведёт к номеру (значение).`,
        String.raw`В словаре ключи не повторяются: два «Мама» в книге невозможны, новая запись просто заменит старую.`],
      title:'Другая книга: характеристики персонажа',
      code:String.raw`
hero = {"имя": "Артас", "уровень": 12, "класс": "паладин"}
print(hero["класс"])
hero["уровень"] += 1      # повысили уровень
hero["оружие"] = "молот"  # новая запись
print(hero)`}),
    S('Безопасный доступ'),
    P(String.raw`Если ключа нет, обращение ‹user["x"]› упадёт с ошибкой ‹KeyError›. Безопасный вариант — ‹.get()›: вернёт ‹None› или значение по умолчанию.`),
    C(String.raw`
user = {"name": "Коля"}
print(user.get("city"))                # None
print(user.get("city", "не указан"))
print("name" in user)                  # есть ли ключ`),
    S('Перебор'),
    P(String.raw`‹.keys()› — ключи, ‹.values()› — значения, ‹.items()› — пары «ключ, значение».`),
    C(String.raw`
prices = {"хлеб": 2, "молоко": 1.5, "сыр": 4}
total = 0
for item, price in prices.items():
    print(item, "-", price, "€")
    total += price
print("Всего:", total)
print(list(prices.keys()), list(prices.values()))`),
    TB(['Что нужно', 'Как'], [
      ['получить / безопасно получить', '‹d[k]› / ‹d.get(k, по_умолчанию)›'],
      ['записать или добавить', '‹d[k] = v›'],
      ['удалить ключ', '‹del d[k]› или ‹d.pop(k)›'],
      ['есть ли ключ', '‹k in d›'],
      ['объединить два словаря', '‹d.update(другой)›'],
      ['сколько пар', '‹len(d)›'],
    ]),
    HOW('Как работает счётчик слов: counts[w] = counts.get(w, 0) + 1', [
      'Приходит слово ‹w›. Сначала Python смотрит правую часть: ‹counts.get(w, 0)›.',
      'Если слово уже есть в словаре, ‹get› вернёт сколько раз его видели. Если нет — вернёт запасное значение 0.',
      'Прибавляем 1: «видели ещё один раз».',
      'Результат записывается в ключ ‹w›: у нового слова появляется запись, у старого обновляется число.'
    ], String.raw`
counts = {}
for w in ["a", "b", "a"]:
    counts[w] = counts.get(w, 0) + 1
    print(w, "->", counts)`),

    S('Список словарей'),
    P(String.raw`Самая частая форма данных в реальных проектах — **список словарей**. Так выглядят ответы API, строки из базы данных и сообщения бота.`),
    C(String.raw`
students = [
    {"name": "Аня", "score": 91},
    {"name": "Борис", "score": 64},
    {"name": "Вика", "score": 78},
]
total = 0
for s in students:
    print(s["name"], s["score"])
    total += s["score"]
print("Средний балл:", round(total / len(students), 1))`),
    E({say:String.raw`Список — стопка анкет, а каждая анкета — словарь с полями. Чтобы обойти всех, листаешь стопку (‹for›), а у каждой анкеты смотришь нужное поле (‹s["score"]›).`,
      title:'Стопка анкет другого вида: товары в магазине',
      code:String.raw`
shop = [
    {"title": "Мышь", "price": 25, "in_stock": True},
    {"title": "Клавиатура", "price": 60, "in_stock": False},
    {"title": "Коврик", "price": 8, "in_stock": True},
]
for item in shop:
    if item["in_stock"]:
        print(item["title"], "-", item["price"], "€")`}),
    S('Словарь внутри словаря'),
    C(String.raw`
users = {
    "kolya": {"age": 20, "langs": ["python", "js"]},
    "anna":  {"age": 22, "langs": ["go"]},
}
print(users["kolya"]["langs"][0])     # python
users["anna"]["langs"].append("rust")
print(users["anna"])`),
    Q(String.raw`Что выведет ‹{"a": 1, "b": 2}.get("c", 0)›?`, ['None', '0', 'KeyError', '"c"'], 1, String.raw`Ключа ‹"c"› нет, поэтому ‹get› возвращает запасное значение — 0. Ошибки не будет.`),

    T({id:'dict-count',
      text:'Посчитай, сколько раз каждое слово встречается в списке ‹words›. Результат — словарь ‹counts›: слово → количество.',
      starter:String.raw`
words = ["a", "b", "a", "c", "b", "a"]
counts = {}`,
      hint:'Для каждого слова: ‹counts[w] = counts.get(w, 0) + 1›. ‹get› с нулём не даст упасть на новом слове.',
      test:String.raw`assert counts == {"a": 3, "b": 2, "c": 1}, f"counts сейчас {counts}"`,
      solution:String.raw`
words = ["a", "b", "a", "c", "b", "a"]
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1`}),
    T({id:'dict-total',
      text:'В словаре ‹cart› лежит корзина: товар → количество. В словаре ‹prices› — цены за штуку. Посчитай в ‹bill› общую стоимость корзины.',
      starter:String.raw`
prices = {"хлеб": 2, "молоко": 1.5, "сыр": 4}
cart = {"хлеб": 2, "сыр": 1, "молоко": 3}
bill = 0`,
      hint:'Пройди по ‹cart.items()›: для каждой пары прибавляй ‹prices[item] * qty›.',
      test:String.raw`assert bill == 12.5, f"bill сейчас {bill}, а нужно 12.5"`,
      solution:String.raw`
prices = {"хлеб": 2, "молоко": 1.5, "сыр": 4}
cart = {"хлеб": 2, "сыр": 1, "молоко": 3}
bill = 0
for item, qty in cart.items():
    bill += prices[item] * qty`}),
    T({id:'dict-group',
      text:'Есть список людей с городами. Собери в ‹by_city› словарь «город → список имён». Для данных ниже получится ‹{"Берлин": ["Аня", "Вика"], "Мюнхен": ["Борис"]}›.',
      starter:String.raw`
people = [
    {"name": "Аня", "city": "Берлин"},
    {"name": "Борис", "city": "Мюнхен"},
    {"name": "Вика", "city": "Берлин"},
]
by_city = {}`,
      hint:'Если города ещё нет в словаре — создай для него пустой список; потом ‹append› имя. Проверка: ‹if city not in by_city›.',
      test:String.raw`assert by_city == {"Берлин": ["Аня", "Вика"], "Мюнхен": ["Борис"]}, f"by_city сейчас {by_city}"`,
      solution:String.raw`
people = [
    {"name": "Аня", "city": "Берлин"},
    {"name": "Борис", "city": "Мюнхен"},
    {"name": "Вика", "city": "Берлин"},
]
by_city = {}
for p in people:
    if p["city"] not in by_city:
        by_city[p["city"]] = []
    by_city[p["city"]].append(p["name"])`}),
    T({id:'dict-invert',
      text:'Есть словарь ‹ru_en› «русское слово → английское». Собери ‹en_ru› наоборот: английское → русское.',
      starter:String.raw`
ru_en = {"кот": "cat", "собака": "dog", "рыба": "fish"}
en_ru = {}`,
      hint:'Пройди по ‹ru_en.items()› и для каждой пары запиши ‹en_ru[en] = ru›.',
      test:String.raw`assert en_ru == {"cat": "кот", "dog": "собака", "fish": "рыба"}, f"en_ru сейчас {en_ru}"`,
      solution:String.raw`
ru_en = {"кот": "cat", "собака": "dog", "рыба": "fish"}
en_ru = {}
for ru, en in ru_en.items():
    en_ru[en] = ru`}),
    T({id:'dict-top', star:true,
      text:'В словаре ‹scores› лежат очки игроков. Запиши в ‹winner› **имя** игрока с наибольшим счётом. Проверка подставит другой словарь.',
      starter:String.raw`
scores = {"Аня": 120, "Борис": 340, "Вика": 275}
winner = ""`,
      hint:'Заведи ‹best_name› и ‹best_score›, пройди по ‹items()› и обновляй их, когда нашёл счёт побольше. Или загугли ‹max(d, key=d.get)›.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("scores ="))
g = {"scores": {"x": 3, "y": 9, "z": 5}}; exec(body, g)
assert g["winner"] == "y", f"нужно 'y', а у тебя {g['winner']!r}"`,
      solution:String.raw`
scores = {"Аня": 120, "Борис": 340, "Вика": 275}
winner = max(scores, key=scores.get)`}),
  ]
});

COURSE.add('trainee', {
  id:'sets', title:'Кортежи и множества', blurb:'Неизменяемые наборы и работа с уникальными значениями.',
  lead:'Два родственника списка: кортеж, который нельзя менять, и множество, где нет повторов.',
  blocks:[
    S('Кортеж'),
    P(String.raw`**Кортеж** ‹(1, 2)› — как список, но неизменяемый. Его используют для данных, которые меняться не должны: координаты, цвет, пара «имя + возраст». Из кортежа можно «распаковать» значения в переменные.`),
    C(String.raw`
point = (3, 4)
print(point[0], len(point))
x, y = point                   # распаковка
print(x, y)

name, age, city = ("Коля", 20, "Берлин")
print(name, city)

a, b = 1, 2
a, b = b, a                    # обмен значений в одну строку!
print(a, b)`),
    E({say:String.raw`Кортеж — запечатанный конверт. Положил внутрь, заклеил — теперь можно читать, но нельзя вытащить одно значение и подставить другое. Зато он надёжный: никто случайно не испортит. Распаковка — это когда ты вскрываешь конверт и раскладываешь содержимое по именованным ящичкам.`,
      title:'Другой конверт: цвет RGB',
      code:String.raw`
color = (255, 128, 0)
r, g, b = color
print("красного:", r, "зелёного:", g, "синего:", b)
# color[0] = 0  # так нельзя, будет TypeError`}),
    S('Множество'),
    P(String.raw`**Множество** ‹{1, 2, 3}› хранит только уникальные значения и не помнит порядок. Идеально, чтобы убрать повторы и быстро проверять «есть ли такое».`),
    C(String.raw`
print(set([1, 2, 2, 3, 3, 3]))     # дубликаты исчезли
tags = {"python", "bot"}
tags.add("api")
tags.add("python")                 # уже есть: ничего не изменилось
print(tags, len(tags))
print("bot" in tags)`),
    W(String.raw`Пустое множество создаётся через ‹set()›, а не через ‹{}›: пустые фигурные скобки — это пустой **словарь**.`),
    S('Операции над множествами'),
    P(String.raw`Множества умеют то, что делали на уроках математики: объединение, пересечение, разность.`),
    C(String.raw`
mine = {"python", "git", "sql"}
job = {"python", "docker", "sql", "linux"}
print(mine | job)    # объединение: всё, что есть хоть где-то
print(mine & job)    # пересечение: что общее
print(job - mine)    # разность: что в job есть, а у меня нет`),
    E({say:String.raw`Два круга Эйлера. В левом — что умеешь ты, в правом — что нужно работодателю. Пересечение (‹&›) — то, что совпало. Разность (‹-›) — «чего мне не хватает». Объединение (‹|›) — всё вместе.`,
      title:'Те же круги про друзей в игре',
      code:String.raw`
alice = {"Боб", "Кира", "Лёша"}
bob = {"Алиса", "Кира", "Лёша", "Дима"}
print("Общие друзья:", alice & bob)
print("Только у Алисы:", alice - bob)
print("Все знакомые:", len(alice | bob))`}),
    Q(String.raw`Что выведет ‹len({1, 1, 2, 2, 3})›?`, ['5', '3', '2', 'Ошибку'], 1, String.raw`Повторы в множестве схлопываются: остаются 1, 2, 3. Значит, длина 3.`),

    T({id:'set-uniq',
      text:'В тексте ‹text› слова повторяются. Запиши в ‹n_uniq› количество **разных** слов (без учёта регистра: «Да» и «да» — одно слово).',
      starter:String.raw`
text = "Да нет да Нет может ДА"
n_uniq = 0`,
      hint:'Приведи к нижнему регистру, раздели на слова, превращай в множество и считай длину: ‹len(set(text.lower().split()))›.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("text ="))
g = {"text": "a b A c B d"}; exec(body, g)
assert g["n_uniq"] == 4, f"нужно 4, а у тебя {g['n_uniq']}"`,
      solution:String.raw`
text = "Да нет да Нет может ДА"
n_uniq = len(set(text.lower().split()))`}),
    T({id:'set-skills',
      text:'Даны навыки кандидата ‹mine› и требования вакансии ‹job›. Запиши в ‹missing› множество того, чего кандидату **не хватает**, и в ‹common› — что у него уже есть из нужного.',
      starter:String.raw`
mine = {"python", "git", "sql"}
job = {"python", "docker", "sql", "linux"}
missing = set()
common = set()`,
      hint:'Не хватает: ‹job - mine›. Общее: ‹job & mine›.',
      test:String.raw`
assert missing == {"docker", "linux"}, f"missing сейчас {missing}"
assert common == {"python", "sql"}, f"common сейчас {common}"`,
      solution:String.raw`
mine = {"python", "git", "sql"}
job = {"python", "docker", "sql", "linux"}
missing = job - mine
common = job & mine`}),
    T({id:'set-dups',
      text:'Найди в ‹dups› **множество** чисел, которые встречаются в списке ‹nums› больше одного раза.',
      starter:String.raw`
nums = [1, 2, 3, 2, 4, 3, 5]
dups = set()`,
      hint:'Заведи пустое множество ‹seen›. Идёшь по числам: если число уже в ‹seen› — это повтор, кладём в ‹dups›; иначе добавляем в ‹seen›. Или ‹nums.count(n) > 1›.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("nums ="))
g = {"nums": [7, 7, 8, 9, 9, 9, 1]}; exec(body, g)
assert g["dups"] == {7, 9}, f"нужно {{7, 9}}, а у тебя {g['dups']}"`,
      solution:String.raw`
nums = [1, 2, 3, 2, 4, 3, 5]
dups = set()
seen = set()
for n in nums:
    if n in seen:
        dups.add(n)
    seen.add(n)`}),
    T({id:'tuple-minmax', star:true,
      text:'Положи в кортеж ‹span› пару ‹(самое маленькое, самое большое)› числа из списка ‹nums›, а потом распакуй её в переменные ‹lo› и ‹hi›.',
      starter:String.raw`
nums = [7, 3, 9, 1, 5]
span = ()
lo = hi = 0`,
      hint:'‹span = (min(nums), max(nums))›, а затем ‹lo, hi = span›.',
      test:String.raw`
body = "\n".join(l for l in __src__.splitlines() if not l.startswith("nums ="))
g = {"nums": [4, 8, 2, 6]}; exec(body, g)
assert g["span"] == (2, 8), f"span сейчас {g['span']}"
assert (g["lo"], g["hi"]) == (2, 8), f"lo, hi сейчас {(g['lo'], g['hi'])}"`,
      solution:String.raw`
nums = [7, 3, 9, 1, 5]
span = (min(nums), max(nums))
lo, hi = span`}),
  ]
});
