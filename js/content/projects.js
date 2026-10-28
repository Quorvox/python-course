/* проекты: каждый с рабочим ядром, этапами и подсказками */
COURSE.pages.projects = {
  title:'Проекты',
  lead:'Проекты — лучший способ научиться и единственный способ собрать портфолио без опыта работы. Выбери по уровню, открой план и иди по этапам. На каждом этапе есть подсказка, если застрял.',
  blocks:[
    S('Как делать проект, чтобы он дошёл до конца'),
    P(String.raw`Большинство проектов умирает на полпути. Не потому что ты слабый, а потому что взялся «сразу всё». Держись простого порядка:`),
    L([
      '**Одна фраза.** Сформулируй, что делает программа, одним предложением: «Спрашивает числа, пока не угадаешь, и считает попытки». Не получилось — идея ещё сырая.',
      '**Минимум (MVP).** Выпиши 3–5 вещей, без которых проект не работает. Остальное (красота, настройки, бонусы) — в список «потом».',
      '**Каркас из функций.** Набросай имена функций и что они принимают и возвращают, даже пустые (‹pass›). Это план в виде кода.',
      '**По одному кусочку.** Сделал функцию, проверил её на двух-трёх примерах (можно через ‹assert›), и только потом следующая.',
      '**Сначала работает, потом красиво.** Не полируй первую версию. Сделай, чтобы работала, затем наведи порядок (рефакторинг).',
      '**Коммит на каждый рабочий шаг.** Так всегда есть куда откатиться, и на GitHub видна история работы.',
      '**Закончи.** Напиши README, выложи, покажи кому-нибудь. Законченный маленький проект весит больше, чем великий недоделанный.',
    ]),
    S('Шаблон: техническое задание на 5 строк'),
    K(String.raw`
Название: Генератор паролей
Что делает: создаёт случайный пароль заданной длины
Вход: длина (число), нужны ли цифры и символы (да/нет)
Выход: пароль и оценка надёжности
Минимум: длина и буквы; потом цифры, символы, оценка
Потом (если останутся силы): копирование в буфер, сохранение истории`, {lang:'text', title:'ТЗ.txt'}),
    S('Шаблон: структура папки проекта'),
    K(String.raw`
my-project/
├── main.py            # точка входа: запускаешь python main.py
├── tasks.py           # логика (функции и классы)
├── storage.py         # чтение и запись файлов
├── test_tasks.py      # тесты
├── data/              # данные (json, csv)
├── requirements.txt   # библиотеки
├── .gitignore         # что не коммитить
└── README.md          # визитка проекта`, {lang:'text', title:'структура'}),
    P(String.raw`Для маленьких проектов хватит одного файла ‹main.py›. Разбивай на модули, когда файл перевалил за 150–200 строк или когда в нём перемешано «ввод-вывод» и «логика».`),
    S('Шаблон README.md'),
    K(String.raw`
# Название проекта

Одна-две фразы: что это и зачем.

## Как запустить
    python main.py

## Пример работы
    > add Купить хлеб
    Добавлено: 1. Купить хлеб

## Что внутри
- Python 3.12, без сторонних библиотек
- данные хранятся в data/tasks.json

## Что можно улучшить
- приоритеты и сроки
- тесты на логику`, {lang:'text', title:'README.md'}),
    S('Как придумать свой проект'),
    L([
      '**Что тебя раздражает?** Руками переименовывать файлы, считать расходы в заметках, искать цены. Автоматизируй это.',
      '**Что тебе интересно?** Игры, спорт, музыка, футбол. Анализ своей любимой статистики или бот для друзей мотивирует лучше любого учебного примера.',
      '**Возьми любимую программу и сделай её маленькую копию:** калькулятор, заметки, плеер списка, трекер привычек.',
      '**Удивляй себя.** Берись за то, что чуть сложнее, чем умеешь. Расти нужно на границе возможностей.',
    ]),
    N(String.raw`Идей на любой вкус полно в [подборке project-based-learning](https://github.com/practical-tutorials/project-based-learning). А что читать и где дальше расти, смотри на странице [«Книги и сайты»](#/books).`),
  ]
};

const PJ = o => COURSE.projects.push(o);

PJ({id:'guess', title:'Угадай число+', level:1, time:'1–2 часа', tags:['циклы', 'функции', 'random'],
  blurb:'Компьютер загадывает число, ты угадываешь. Игра с подсказками, ограничением попыток и сохранением рекорда.',
  learn:['цикл ‹while› и ‹for› с ‹break›', 'функции, которые возвращают результат', 'модуль ‹random›', 'работа с файлом ‹json› (рекорд)'],
  needs:['loops', 'functions', 'game'],
  demo:String.raw`
def check(secret, guess):
    if guess < secret:
        return "больше"
    if guess > secret:
        return "меньше"
    return "угадал"

secret = 42   # в настоящей игре тут random.randint(1, 100)
max_tries = 5
for attempt in range(1, max_tries + 1):
    guess = int(input(f"Попытка {attempt}/{max_tries}: "))
    result = check(secret, guess)
    if result == "угадал":
        print(f"Угадал за {attempt}!")
        break
    print("Загаданное число", result)
else:
    print("Попытки кончились, было", secret)`, stdin:'50\n30\n42',
  stages:[
    {title:'Загадать число', text:'Подключи ‹random› и положи случайное число от 1 до 100 в переменную.', help:'Функция ‹random.randint(a, b)› включает обе границы. Загадывать надо один раз, до цикла.', code:'import random\nsecret = random.randint(1, 100)'},
    {title:'Цикл попыток', text:'Спрашивай число через ‹input› и ‹int›, пока игрок не угадает.', help:'Используй ‹while True› и выходи через ‹break›. Если боишься бесконечного цикла, сначала ограничь его ‹for attempt in range(10)›.'},
    {title:'Подсказки «больше / меньше»', text:'После каждой догадки говори, в какую сторону ошибся. Вынеси проверку в функцию ‹check(secret, guess)›.', help:'Функция должна **возвращать** слово, а не печатать. Тогда её легко проверить: ‹assert check(5, 3) == "больше"›.'},
    {title:'Ограничение попыток и уровни', text:'Дай игроку 7 попыток. Добавь выбор сложности: лёгкий (1–50), обычный (1–100), сложный (1–1000).', help:'Сложность — это словарь «название → верхняя граница». Попытки можно считать по формуле: ⌈log₂(N)⌉ + 1 хватает при разумной игре.'},
    {title:'Защита от неправильного ввода', text:'Если ввели не число, не падай, а проси ещё раз.', help:'Оберни ‹int(input())› в ‹try› / ‹except ValueError› внутри цикла, и при ошибке делай ‹continue›.', code:'while True:\n    raw = input("Число: ")\n    try:\n        guess = int(raw)\n        break\n    except ValueError:\n        print("Нужно число!")'},
    {title:'Рекорд в файле', text:'Запоминай лучший результат (минимум попыток) в ‹record.json› и показывай его.', help:'Читай файл при старте (если нет, рекорд пустой), а записывай, когда игрок побил рекорд. Не забудь ‹encoding="utf-8"› и ‹ensure_ascii=False›.'},
  ],
  ideas:['режим «компьютер угадывает твоё число»: бинарный поиск', 'таблица лучших игроков с именами', 'оценка по количеству попыток («гений», «неплохо»)', 'графическая версия на ‹tkinter›'],
  readme:['Правила игры и пример партии в README.']});

PJ({id:'password', title:'Генератор паролей', level:1, time:'1 час', tags:['строки', 'random', 'функции'],
  blurb:'Создаёт надёжные пароли нужной длины, гарантирует цифры и символы и оценивает силу.',
  learn:['модули ‹string› и ‹secrets›', 'функции с параметрами по умолчанию', 'работа со строками и списками', 'основы безопасности паролей'],
  needs:['strings', 'lists', 'functions'],
  demo:String.raw`
import secrets
import string

SYMBOLS = "!@#$%^&*-_"

def make_password(length=12, digits=True, symbols=True):
    pool = string.ascii_letters
    required = [secrets.choice(string.ascii_lowercase), secrets.choice(string.ascii_uppercase)]
    if digits:
        pool += string.digits
        required.append(secrets.choice(string.digits))
    if symbols:
        pool += SYMBOLS
        required.append(secrets.choice(SYMBOLS))
    chars = required + [secrets.choice(pool) for _ in range(length - len(required))]
    secrets.SystemRandom().shuffle(chars)
    return "".join(chars)

def strength(pw):
    points = sum([len(pw) >= 12, any(c.isdigit() for c in pw),
                  any(c.isupper() for c in pw), any(not c.isalnum() for c in pw)])
    return ["слабый", "слабый", "средний", "хороший", "отличный"][points]

for n in (8, 12, 16):
    pw = make_password(n)
    print(pw, "-", strength(pw))`,
  stages:[
    {title:'Набор символов', text:'Собери «алфавит» из строчных, заглавных букв и цифр.', help:'В модуле ‹string› уже есть всё: ‹string.ascii_lowercase›, ‹string.ascii_uppercase›, ‹string.digits›.', code:'import string\npool = string.ascii_letters + string.digits'},
    {title:'Случайный выбор', text:'Составь пароль из ‹length› случайных символов набора.', help:'Для паролей используй ‹secrets.choice›, а не ‹random.choice›: модуль ‹secrets› создан для безопасности, ‹random› предсказуем.', code:'import secrets\npw = "".join(secrets.choice(pool) for _ in range(length))'},
    {title:'Настройки', text:'Спроси у пользователя длину и нужны ли цифры и символы. Оформи в функцию с параметрами по умолчанию.', help:'Параметры: ‹def make_password(length=12, digits=True, symbols=True)›. Ввод «да/нет» превращай в ‹bool›: ‹input().lower() == "да"›.'},
    {title:'Гарантия разнообразия', text:'Следи, чтобы в пароле точно была хотя бы одна буква каждого выбранного типа.', help:'Сначала возьми по одному символу каждого типа (список ‹required›), добери остальное случайными, потом перемешай весь список через ‹shuffle›.'},
    {title:'Оценка надёжности', text:'Сделай функцию ‹strength(pw)›, которая считает баллы: длина ≥ 12, есть цифра, заглавная, спецсимвол.', help:'‹any(c.isdigit() for c in pw)› проверяет «есть ли хоть одна цифра». Суммируй ‹True› как единицы.'},
    {title:'Несколько паролей и красивый вывод', text:'Предложи сразу 5 вариантов и покажи оценку рядом.', help:'Простой цикл ‹for› и f-строка с выравниванием: ‹f"{pw:<20} {strength(pw)}"›.'},
  ],
  ideas:['копирование в буфер обмена (библиотека ‹pyperclip›)', 'парольные фразы из слов', 'проверка, нет ли пароля в списке популярных', 'простое окно на ‹tkinter›'],
  readme:['Предупреждение: пароли генерируются локально и никуда не отправляются.']});

PJ({id:'todo', title:'Список дел в терминале', level:1, time:'2–3 часа', tags:['списки', 'словари', 'json', 'цикл'],
  blurb:'Консольное приложение: добавляй задачи, отмечай выполненные, удаляй. Данные не пропадают после закрытия.',
  learn:['главный цикл программы с командами', 'список словарей как база данных', 'сохранение и чтение JSON', 'разбор строки команды'],
  needs:['lists', 'dicts', 'files'],
  demo:String.raw`
import json
tasks = []

def show():
    if not tasks:
        print("Пусто")
    for i, t in enumerate(tasks, 1):
        mark = "x" if t["done"] else " "
        print(f"{i}. [{mark}] {t['title']}")

while True:
    cmd, _, arg = input("> ").strip().partition(" ")
    if cmd == "add" and arg:
        tasks.append({"title": arg, "done": False})
    elif cmd == "done" and arg.isdigit() and 0 < int(arg) <= len(tasks):
        tasks[int(arg) - 1]["done"] = True
    elif cmd == "del" and arg.isdigit() and 0 < int(arg) <= len(tasks):
        tasks.pop(int(arg) - 1)
    elif cmd == "list":
        show()
    elif cmd == "quit":
        print(json.dumps(tasks, ensure_ascii=False))
        break
    else:
        print("Команды: add <текст>, done <номер>, del <номер>, list, quit")`,
  stdin:'add Купить хлеб\nadd Сдать курсовую\nlist\ndone 1\nlist\nquit',
  stages:[
    {title:'Модель данных', text:'Реши, как хранить задачу: словарь с полями ‹title› и ‹done›. Все задачи лежат в списке.', help:'Список словарей — самая частая форма данных: ‹[{"title": "…", "done": False}, …]›. Подумай заранее, какие поля понадобятся (срок? приоритет?).'},
    {title:'Главный цикл', text:'Бесконечный цикл, который читает команду и выполняет её. Выход — по ‹quit›.', help:'Так устроены почти все консольные программы: ‹while True›, ввод, цепочка ‹if / elif›, ‹break› на выходе. Команду удобно делить через ‹partition(" ")›.', code:'while True:\n    cmd, _, arg = input("> ").strip().partition(" ")\n    if cmd == "quit":\n        break'},
    {title:'Добавить и показать', text:'Команды ‹add <текст>› и ‹list›. В списке показывай номер, галочку и текст.', help:'Номера для пользователя начинаются с 1: ‹enumerate(tasks, 1)›. Для галочки: ‹"x" if t["done"] else " "›.'},
    {title:'Выполнить и удалить', text:'Команды ‹done <номер>› и ‹del <номер>›. Проверь, что номер существует.', help:'Номер приходит строкой: сначала ‹arg.isdigit()›, потом ‹int(arg)›, потом проверка границ ‹0 < n <= len(tasks)›. Индекс в списке на 1 меньше номера.'},
    {title:'Сохранение в файл', text:'При запуске читай ‹tasks.json›, при выходе (и после каждого изменения) записывай.', help:'Две функции: ‹load()› (если файла нет — пустой список) и ‹save()›. Файл читай через ‹try› / ‹except FileNotFoundError›.', code:'import json\nfrom pathlib import Path\n\nFILE = Path("tasks.json")\n\ndef load():\n    if FILE.exists():\n        return json.loads(FILE.read_text(encoding="utf-8"))\n    return []\n\ndef save(tasks):\n    FILE.write_text(json.dumps(tasks, ensure_ascii=False, indent=2), encoding="utf-8")'},
    {title:'Приоритеты и сортировка', text:'Добавь приоритет (1–3) и показывай задачи сначала важные. Команда ‹list todo› покажет только невыполненные.', help:'Сортировка по приоритету: ‹sorted(tasks, key=lambda t: t["priority"])›. Но помни про номера: показывай их по исходному списку, иначе ‹done 2› укажет не на ту задачу.'},
  ],
  ideas:['сроки и напоминание о просроченных', 'теги и фильтр по ним', 'то же на классах: [проект «Менеджер задач»](#/j-project) уровня «Джун»', 'тесты на логику через ‹assert›'],
  readme:['Список команд и пример сессии (скопируй из терминала).']});

PJ({id:'quiz', title:'Викторина', level:1, time:'2 часа', tags:['словари', 'цикл', 'json'],
  blurb:'Задаёт вопросы с вариантами ответов, считает баллы и выставляет оценку. Вопросы лежат в отдельном файле.',
  learn:['списки словарей как «база вопросов»', 'вложенные циклы и ввод', 'отделение данных от кода', 'перемешивание ‹random.shuffle›'],
  needs:['dicts', 'loops', 'files'],
  demo:String.raw`
questions = [
    {"q": "Сколько будет 2 ** 5?", "options": ["10", "25", "32"], "answer": 3},
    {"q": "Какой тип у числа 3.14?", "options": ["int", "float", "str"], "answer": 2},
    {"q": "Как называется цикл «пока»?", "options": ["for", "while", "loop"], "answer": 2},
]

score = 0
for n, item in enumerate(questions, 1):
    print(f"\nВопрос {n}: {item['q']}")
    for i, opt in enumerate(item["options"], 1):
        print(f"  {i}) {opt}")
    answer = int(input("Твой ответ: "))
    if answer == item["answer"]:
        print("Верно!")
        score += 1
    else:
        print("Неверно, правильный ответ:", item["options"][item["answer"] - 1])

print(f"\nИтог: {score} из {len(questions)}")`, stdin:'3\n2\n2',
  stages:[
    {title:'Вопросы как данные', text:'Составь список из 5–10 вопросов. У каждого: текст, варианты и номер верного.', help:'Список словарей из примера выше. Данные отдельно от кода: потом их легко вынести в файл.'},
    {title:'Один вопрос', text:'Напиши функцию ‹ask(item)›, которая показывает вопрос, принимает ответ и возвращает ‹True› / ‹False›.', help:'Возвращай результат, а не считай внутри: так ‹ask› можно проверить отдельно.'},
    {title:'Подсчёт и оценка', text:'Пройди по всем вопросам, посчитай баллы и выдай оценку («10/10 — гений», «5/10 — есть куда расти»).', help:'Оценку удобно выбирать по доле верных ответов: ‹score / len(questions)› и цепочка ‹if›.'},
    {title:'Защита от неверного ввода', text:'Если ввели не число или число вне списка, проси ещё раз.', help:'Отдельная функция ‹read_choice(n)›, которая крутит ‹while True›, пока ввод не станет корректным.'},
    {title:'Случайный порядок', text:'Перемешивай вопросы и варианты при каждом запуске.', help:'‹random.shuffle(questions)›. Для вариантов: перемешай, но запомни, где теперь верный (храни текст верного ответа, а не его номер).'},
    {title:'Вопросы в файле', text:'Вынеси вопросы в ‹questions.json›, чтобы можно было добавлять без правки кода.', help:'Формат тот же, что и список словарей. Читай через ‹json.load›. Тогда друг сможет сделать свою викторину, не трогая код.'},
  ],
  ideas:['категории и выбор темы', 'таймер на ответ (модуль ‹time›)', 'таблица рекордов', 'викторина по Python из этого курса'],
  readme:['Покажи, как добавить свои вопросы в ‹questions.json›.']});

PJ({id:'expenses', title:'Учёт расходов', level:2, time:'3–4 часа', tags:['словари', 'json', 'даты', 'функции'],
  blurb:'Записывает траты, считает суммы по категориям и месяцам, сохраняет данные и печатает аккуратный отчёт.',
  learn:['группировка данных (по категориям и месяцам)', 'работа с датами в формате ISO', 'форматирование отчёта в f-строках', 'разбиение программы на функции и модули'],
  needs:['dicts', 'functions', 'files', 'project'],
  demo:String.raw`
from collections import defaultdict

expenses = [
    {"date": "2026-10-03", "title": "Проездной", "amount": 49.0, "category": "транспорт"},
    {"date": "2026-10-07", "title": "Обед в мензе", "amount": 3.5, "category": "еда"},
    {"date": "2026-10-12", "title": "Steam", "amount": 19.99, "category": "игры"},
    {"date": "2026-11-01", "title": "Ужин", "amount": 7.5, "category": "еда"},
]

def in_month(items, ym):
    return [e for e in items if e["date"].startswith(ym)]

def by_category(items):
    sums = defaultdict(float)
    for e in items:
        sums[e["category"]] += e["amount"]
    return dict(sums)

def report(items, title):
    lines = [title, "-" * 28]
    sums = by_category(items)
    for cat in sorted(sums, key=sums.get, reverse=True):
        lines.append(f"{cat:<14}{sums[cat]:>10.2f} €")
    lines += ["-" * 28, f"{'Итого':<14}{sum(sums.values()):>10.2f} €"]
    return "\n".join(lines)

print(report(in_month(expenses, "2026-10"), "Октябрь 2026"))
print()
print(report(expenses, "Всё время"))`,
  stages:[
    {title:'Данные', text:'Опиши трату словарём: дата (строкой ‹2026-10-03›), название, сумма, категория. Все траты в списке.', help:'Дату храни в формате ISO ‹ГГГГ-ММ-ДД›: такие строки сортируются как текст, а месяц — это просто начало строки.'},
    {title:'Функции учёта', text:'‹add_expense›, ‹total›, ‹by_category›. Они не печатают, а возвращают результат.', help:'‹by_category› — словарь «категория → сумма». Приём: ‹sums[cat] = sums.get(cat, 0) + amount› или ‹defaultdict(float)›.'},
    {title:'Фильтр по месяцу', text:'Функция ‹in_month(items, "2026-10")› возвращает траты за месяц.', help:'‹e["date"].startswith(ym)›. Если захочешь «за последние 7 дней», понадобится ‹datetime›.'},
    {title:'Красивый отчёт', text:'Сделай таблицу с выровненными колонками и итогом.', help:'В f-строках: ‹{cat:<14}› прижимает влево в поле 14 символов, ‹{sum:>10.2f}› прижимает вправо с двумя знаками.'},
    {title:'Сохранение', text:'Храни траты в ‹expenses.json›: читай при старте, записывай после каждого добавления.', help:'Как в проекте со списком дел: функции ‹load()› и ‹save()›. Не забудь ‹ensure_ascii=False›.'},
    {title:'Меню', text:'Главный цикл: «1) добавить, 2) отчёт за месяц, 3) отчёт за всё время, 0) выход».', help:'Ввод суммы оберни в ‹try› / ‹except ValueError›. Запятую в «3,5» замени на точку перед ‹float›.'},
    {title:'Тесты логики', text:'Проверь ‹by_category› и ‹in_month› на маленьком наборе данных через ‹assert›.', help:'Такие функции чистые (данные на входе, результат на выходе), и поэтому тестируются легче всего.'},
  ],
  ideas:['график по категориям (‹matplotlib› на компьютере)', 'лимит бюджета и предупреждение', 'экспорт в CSV для Excel', 'ежемесячный сравнительный отчёт'],
  readme:['Скриншот отчёта (текстом из терминала).', 'Какие категории поддерживаются.']});

PJ({id:'hangman', title:'Виселица', level:2, time:'2–3 часа', tags:['множества', 'строки', 'цикл'],
  blurb:'Игра «угадай слово по буквам» с маской слова, счётчиком ошибок и ASCII-рисунком виселицы.',
  learn:['множества для угаданных букв', 'строки: маска, join, генераторы', 'управление состоянием игры', 'вывод ASCII-графики'],
  needs:['sets', 'strings', 'loops'],
  demo:String.raw`
word = "python"
guessed = set()
mistakes = 0
MAX = 6

while mistakes < MAX:
    shown = " ".join(c if c in guessed else "_" for c in word)
    print(shown, f"(ошибок: {mistakes}/{MAX})")
    if "_" not in shown:
        print("Победа!")
        break
    letter = input("Буква: ").lower().strip()
    if len(letter) != 1 or not letter.isalpha():
        print("Нужна одна буква")
        continue
    if letter in guessed:
        print("Уже была")
        continue
    guessed.add(letter)
    if letter not in word:
        mistakes += 1
else:
    print("Проигрыш, слово было:", word)`, stdin:'p\ny\nx\nt\nh\no\nn',
  stages:[
    {title:'Слово и маска', text:'Выбери слово и показывай его как ‹_ _ t _ _ _› с открытыми угаданными буквами.', help:'Храни угаданные буквы в множестве. Маска: ‹" ".join(c if c in guessed else "_" for c in word)›.'},
    {title:'Ход игрока', text:'Спрашивай букву. Проверяй, что это одна буква и что её ещё не называли.', help:'Условия ввода: ‹len(letter) == 1 and letter.isalpha()›, и ‹letter in guessed› для повтора. На неправильный ввод — ‹continue›, ошибка при этом не засчитывается.'},
    {title:'Ошибки и конец игры', text:'Считай промахи; при 6 игра проиграна, если угаданы все буквы, это победа.', help:'Цикл ‹while mistakes < MAX› с веткой ‹else› (она выполнится, если цикл закончился без ‹break›, то есть проигрыш).'},
    {title:'Рисунок виселицы', text:'Покажи по стадии ошибок ASCII-рисунок (7 вариантов от пустого до полного).', help:'Список из 7 строк-рисунков и вывод ‹STAGES[mistakes]›. Многострочные строки пиши в тройных кавычках.', code:'STAGES = [\n    "  +---+\\n      |\\n      |\\n      |\\n     ===",\n    "  +---+\\n  O   |\\n      |\\n      |\\n     ===",\n    # ... добавь остальные стадии сам\n]'},
    {title:'Слова из файла', text:'Положи десятки слов в ‹words.txt› и выбирай случайное.', help:'‹random.choice(список)›. Слова читай построчно и чисти от пробелов. Следи за кодировкой UTF-8.'},
    {title:'Категории и сложность', text:'Дай выбрать тему (животные, страны, программирование) и длину слова.', help:'Словарь «тема → список слов». Выбор сложности — фильтр по ‹len(word)›.'},
  ],
  ideas:['подсказка за «штрафную» ошибку', 'режим для двоих (один загадывает)', 'статистика побед', 'слова на русском с буквой «ё»'],
  readme:['Покажи экран игры в README (вставь текстовый вывод).']});

PJ({id:'converter', title:'Конвертер валют', level:2, time:'2 часа', tags:['словари', 'ошибки', 'API'],
  blurb:'Переводит суммы между валютами по курсам. Сначала по готовой таблице, потом с живыми курсами из интернета.',
  learn:['словари как справочники', 'разбор строки пользователя и обработка ошибок', 'HTTP-запросы и JSON от API', 'кэширование данных в файле'],
  needs:['dicts', 'errors', 'files'],
  demo:String.raw`
RATES = {"EUR": 1.0, "USD": 1.08, "RUB": 98.0, "GBP": 0.85}   # демо-курсы к евро

def convert(amount, src, dst):
    if src not in RATES or dst not in RATES:
        raise ValueError("неизвестная валюта")
    return round(amount / RATES[src] * RATES[dst], 2)

while True:
    line = input("Например: 100 EUR USD (или quit): ").strip()
    if line == "quit":
        break
    try:
        amount, src, dst = line.split()
        print(convert(float(amount), src.upper(), dst.upper()))
    except ValueError as e:
        print("Ошибка:", e)`, stdin:'100 EUR USD\n50 usd rub\nabc\nquit',
  stages:[
    {title:'Таблица курсов', text:'Заведи словарь «валюта → сколько единиц за 1 евро». Курсы пока придуманные.', help:'Все курсы к одной базовой валюте, чтобы хватало одного словаря: любую пару можно получить как «src → евро → dst».'},
    {title:'Функция convert', text:'Принимает сумму и две валюты, возвращает результат с двумя знаками.', help:'Формула: ‹amount / RATES[src] * RATES[dst]›. Для неизвестной валюты бросай ‹ValueError›.'},
    {title:'Диалог с пользователем', text:'Читай строку вида ‹100 EUR USD›, раскладывай на три части.', help:'‹amount, src, dst = line.split()›. Если частей не три, Python бросит ‹ValueError›, и ты его перехватишь.'},
    {title:'Устойчивость к ошибкам', text:'Любой странный ввод даёт понятное сообщение, а не падение.', help:'Один ‹try› вокруг разбора и конвертации. Сообщение берёшь из ‹e›. Запятую в «3,5» меняй на точку.'},
    {title:'Живые курсы через API', text:'Скачай курсы из открытого сервиса (на компьютере с установленным ‹requests›).', help:'Установи библиотеку: ‹pip install requests›. Подходящий открытый сервис курсов — [Frankfurter](https://frankfurter.dev/) (данные Европейского центрального банка). Структуру ответа смотри в его документации. В браузере курса ‹requests› не работает, этот этап делай в VS Code.', code:'import requests\n\ndef load_rates():\n    r = requests.get("https://api.frankfurter.dev/v1/latest?base=EUR", timeout=10)\n    r.raise_for_status()\n    data = r.json()\n    rates = data["rates"]\n    rates["EUR"] = 1.0\n    return rates'},
    {title:'Кэш и история', text:'Сохраняй скачанные курсы в файл на день и записывай историю конвертаций.', help:'Файл ‹rates.json› с датой скачивания: если дата сегодняшняя, берёшь из файла, иначе качаешь заново. Так не долбишь сервис лишний раз.'},
  ],
  ideas:['команда «все курсы к одной валюте»', 'график курса за месяц', 'бот в Telegram с этим конвертером', 'офлайн-режим с последними сохранёнными курсами'],
  readme:['Откуда берутся курсы и как часто обновляются.', 'Предупреждение: курсы информационные, не для финансовых решений.']});

PJ({id:'tictactoe', title:'Крестики-нолики', level:2, time:'3–4 часа', tags:['списки', 'функции', 'алгоритмы'],
  blurb:'Игра на двоих в терминале: доска, ходы, проверка победы и ничьи. Потом добавляем бота.',
  learn:['список как игровое поле', 'проверка выигрышных комбинаций', 'структура игры: состояние, ход, проверка', 'простой ИИ-противник'],
  needs:['lists', 'functions', 'loops'],
  demo:String.raw`
LINES = [(0, 1, 2), (3, 4, 5), (6, 7, 8), (0, 3, 6), (1, 4, 7), (2, 5, 8), (0, 4, 8), (2, 4, 6)]

def show(b):
    for r in range(0, 9, 3):
        print(" " + " | ".join(b[r:r + 3]))
        if r < 6:
            print("---+---+---")

def winner(b):
    for a, c, d in LINES:
        if b[a] != " " and b[a] == b[c] == b[d]:
            return b[a]
    return None

board = [" "] * 9
player = "X"
for turn in range(9):
    show(board)
    while True:
        cell = int(input(f"Ход {player} (1-9): ")) - 1
        if 0 <= cell < 9 and board[cell] == " ":
            break
        print("Так нельзя")
    board[cell] = player
    if winner(board):
        show(board)
        print("Победил", player)
        break
    player = "O" if player == "X" else "X"
else:
    show(board)
    print("Ничья")`, stdin:'1\n4\n2\n5\n3',
  stages:[
    {title:'Доска', text:'Хранить поле проще всего списком из 9 пробелов. Напиши ‹show(board)›, которая рисует его 3×3.', help:'Строка поля: ‹board[0:3]›, ‹board[3:6]›, ‹board[6:9]›. Цикл ‹for r in range(0, 9, 3)›.'},
    {title:'Ход игрока', text:'Спрашивай номер клетки 1–9, проверяй, что она свободна, и ставь знак.', help:'Цикл ‹while True› с ‹break›, когда ход допустим. Номер на экране 1–9, а индекс 0–8: вычитай единицу.'},
    {title:'Проверка победы', text:'‹winner(board)› возвращает ‹"X"›, ‹"O"› или ‹None›.', help:'8 выигрышных троек индексов (3 строки, 3 столбца, 2 диагонали) в списке ‹LINES›. Для каждой: три клетки одинаковые и не пробел.'},
    {title:'Смена игроков и ничья', text:'Игроки ходят по очереди. Если 9 ходов сделано, а победителя нет, это ничья.', help:'‹for turn in range(9)› с веткой ‹else› у цикла: сработает, если ‹break› не было, то есть ничья.'},
    {title:'Играем с компьютером', text:'Сделай ‹bot_move(board)›: сначала случайная свободная клетка.', help:'‹free = [i for i, c in enumerate(board) if c == " "]› и ‹random.choice(free)›.', code:'import random\n\ndef bot_move(board):\n    free = [i for i, c in enumerate(board) if c == " "]\n    return random.choice(free)'},
    {title:'Умный бот', text:'Пусть бот сначала выигрывает сам, потом блокирует чужую победу, потом берёт центр.', help:'Для каждой свободной клетки поставь туда знак «на пробу» и проверь ‹winner›. Это перебор вариантов: так думают простые шахматные программы.'},
  ],
  ideas:['поле 4×4 или 5×5 (победа — четыре в ряд)', 'счёт нескольких партий', 'неуязвимый бот на алгоритме minimax', 'графика на ‹tkinter› или ‹pygame›'],
  readme:['Правила и пример партии, список реализованных режимов.']});

PJ({id:'text', title:'Анализатор текста', level:2, time:'2 часа', tags:['строки', 'словари', 'collections'],
  blurb:'Берёт любой текст, считает слова, находит самые частые и самые длинные и рисует гистограмму прямо в терминале.',
  learn:['обработка текста: очистка, разбор на слова', '‹Counter› и сортировка по ключу', 'чтение файла по частям', 'форматированный вывод'],
  needs:['strings', 'dicts', 'files'],
  demo:String.raw`
from collections import Counter

text = """Python прост и мощен. Python любят за читаемость, а читаемость
помогает писать код, который понимают другие. Простой код лучше сложного."""

def words_of(s):
    cleaned = "".join(c.lower() if c.isalpha() else " " for c in s)
    return cleaned.split()

words = words_of(text)
freq = Counter(words)

print("Слов:", len(words), "| разных:", len(freq))
print("Самое длинное:", max(words, key=len))
print()
for word, n in freq.most_common(5):
    print(f"{word:<12}{'█' * n} {n}")`,
  stages:[
    {title:'Очистка текста', text:'Приведи текст к нижнему регистру и убери знаки препинания, чтобы «Python,» и «python» были одним словом.', help:'Заменяй всё, что не буква, на пробел, а потом ‹split()›: ‹"".join(c.lower() if c.isalpha() else " " for c in s).split()›.'},
    {title:'Подсчёт', text:'Посчитай количество слов и количество разных слов.', help:'Всего — ‹len(words)›, разных — ‹len(set(words))›.'},
    {title:'Частотный словарь', text:'Найди 10 самых частых слов.', help:'Руками: ‹freq[w] = freq.get(w, 0) + 1›. Короче: ‹Counter(words).most_common(10)›. Попробуй оба способа.'},
    {title:'Гистограмма', text:'Рядом со словом нарисуй столбик из символов.', help:'Строку можно умножать на число: ‹"█" * n›. Выравнивай слова в f-строке: ‹{word:<12}›.'},
    {title:'Текст из файла', text:'Читай настоящий текст из ‹book.txt› и принимай имя файла из ввода.', help:'‹Path(name).read_text(encoding="utf-8")›. Если файла нет — понятное сообщение вместо падения.'},
    {title:'Фильтр шума', text:'Убери «стоп-слова» (и, в, на, что) из статистики.', help:'Множество стоп-слов и условие ‹if w not in STOP›. Проверка в множестве быстрая.'},
  ],
  ideas:['сравнение двух текстов по общим словам', 'средняя длина предложения', 'поиск самых частых пар слов', 'тот же анализ для текста любимой песни или книги'],
  readme:['Пример вывода на небольшом тексте, который можно вставить в README.']});

PJ({id:'bot', title:'Telegram-бот', level:3, time:'4–6 часов', tags:['aiogram', 'async', 'API'],
  blurb:'Бот, который отвечает на команды. Сначала логику пишем и проверяем здесь, потом подключаем к Telegram на компьютере.',
  learn:['разделение «логики ответа» и «обвязки Telegram»', 'библиотека ‹aiogram› и ‹async› / ‹await›', 'хранение токена в ‹.env›', 'хранение данных и запуск на сервере'],
  needs:['functions', 'errors', 'files', 'j-funcs'],
  demo:String.raw`
import random
random.seed(2)

def reply(text):
    text = text.strip()
    if text == "/start":
        return "Привет! Я учебный бот. Напиши /help"
    if text == "/help":
        return "Команды: /start, /help, /dice, /sum 2 3"
    if text == "/dice":
        return f"Выпало: {random.randint(1, 6)}"
    if text.startswith("/sum"):
        try:
            a, b = map(float, text.split()[1:])
            return str(a + b)
        except ValueError:
            return "Формат: /sum 2 3"
    return "Не понял. Напиши /help"

for msg in ["/start", "/dice", "/sum 2 3", "/sum два три", "привет"]:
    print(">", msg)
    print(reply(msg))`,
  stages:[
    {title:'Логика ответов без Telegram', text:'Напиши функцию ‹reply(text) → str›. Она знает команды и ничего не знает про Telegram. Её можно проверять здесь.', help:'Хороший бот строится вокруг чистой функции «что ответить на такой текст». Тогда тесты простые, а Telegram — лишь тонкая обвязка вокруг неё.'},
    {title:'Создай бота и получи токен', text:'В Telegram найди @BotFather, команда ‹/newbot›, придумай имя. Он даст токен: длинную строку.', help:'**Токен — это пароль от бота.** Не публикуй его, не отправляй в чаты и не клади в код. Храни в файле ‹.env› рядом с проектом и добавь ‹.env› в ‹.gitignore›.', code:'BOT_TOKEN=сюда_токен_от_BotFather'},
    {title:'Установка и каркас', text:'Установи ‹aiogram› и ‹python-dotenv› (в виртуальном окружении) и запусти эхо-бота.', help:'Команда: ‹pip install aiogram python-dotenv›. Синтаксис библиотеки меняется между версиями, поэтому сверяйся с [документацией aiogram](https://docs.aiogram.dev/). Ниже каркас для aiogram 3.', code:'import asyncio\nimport os\n\nfrom aiogram import Bot, Dispatcher\nfrom aiogram.filters import Command\nfrom aiogram.types import Message\nfrom dotenv import load_dotenv\n\nload_dotenv()\nbot = Bot(os.environ["BOT_TOKEN"])\ndp = Dispatcher()\n\n@dp.message(Command("start"))\nasync def start(message: Message):\n    await message.answer("Привет! Я бот.")\n\n@dp.message()\nasync def any_text(message: Message):\n    await message.answer(reply(message.text or ""))\n\nasync def main():\n    await dp.start_polling(bot)\n\nasyncio.run(main())'},
    {title:'Подключи свою логику', text:'Вместо эха отвечай через ‹reply()›. Добавь свои команды.', help:'Функция ‹reply› из первого этапа лежит в отдельном файле ‹logic.py›; в боте её просто импортируют. Так код остаётся чистым.'},
    {title:'Хранение данных', text:'Запоминай что-то про пользователей: заметки, счётчики, настройки. Начни с JSON, потом SQLite.', help:'Ключ — ‹message.from_user.id›. Для начала словарь ‹{id: данные}› в ‹data.json›. Когда пользователей станет много, переходи на ‹sqlite3› (есть в стандартной библиотеке).'},
    {title:'Запуск «навсегда»', text:'Бот должен работать, когда твой компьютер выключен. Нужен сервер.', help:'Варианты: арендованный VPS (запуск через ‹systemd› или Docker) или бесплатные/дешёвые хостинги для ботов. Секреты держи в переменных окружения, а не в репозитории.'},
  ],
  ideas:['бот-напоминалка с таймерами', 'бот-викторина на вопросах из проекта «Викторина»', 'бот, показывающий курсы валют', 'кнопки (inline-клавиатура) вместо команд'],
  readme:['Как получить токен и создать ‹.env› (без самого токена!).', 'Список команд бота и скриншот диалога.', 'Ссылка на бота в Telegram, если он запущен.']});
