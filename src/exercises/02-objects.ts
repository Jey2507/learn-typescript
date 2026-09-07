/**
 * ВПРАВА 2 — Типізація об'єктів: type / interface, optional (?), readonly
 *
 * ==========================================================================
 * ТЕОРІЯ (детально, з прикладами одразу під кожним пунктом)
 * ==========================================================================
 *
 * 1. Найпростіший спосіб типізувати об'єкт — "inline"-тип прямо в анотації:
 */

function printUser(user: { name: string; age: number }) {
  console.log(`${user.name}, ${user.age}`);
}
printUser({ name: "Oleh", age: 25 });
// printUser({ name: "Oleh" }); // ПОМИЛКА: бракує "age"
// printUser({ name: "Oleh", age: 25, city: "Kyiv" }); // ПОМИЛКА при inline-об'єкті
// (excess property check — TS підозріло ставиться до "зайвих" полів,
//  але ТІЛЬКИ коли даєш об'єкт-літерал напряму в аргумент, а не через змінну)

/**
 * 2. Це незручно писати кожного разу, тому форму об'єкта виносять
 *    в окремий тип. Два способи — `type` і `interface`. Для звичайних
 *    об'єктів вони майже однакові:
 */

type User = { name: string; age: number };
interface UserI { name: string; age: number }
console.log({} as User, {} as UserI); // (тут лише щоб TS не лаявся на "unused" — це просто демонстрація типів)

// Різниця (коротко, не критично на старті):
// - `interface` можна доповнювати (declaration merging) і краще підходить
//   для об'єктів/класів, часто саме її обирають за конвенцією в OOP-стилі.
// - `type` гнучкіший: може описувати union (`"a" | "b"`), tuple, primitive alias
//   — те, що `interface` не вміє.
// На практиці: обирай один стиль і будь послідовним. Далі в цих вправах
// я буду використовувати `type`, бо ми вже проходили union/literal через `type`.

/**
 * 3. Optional property `?` — поле, яке МОЖЕ бути відсутнім.
 *    Якщо поля немає в об'єкті — це ОК. Якщо воно є — тип має відповідати.
 *    Всередині коду TS вважає таке поле `T | undefined`, тому перед
 *    використанням часто треба перевірити (`if (user.nickname) ...`).
 */

type Profile = {
  name: string;
  nickname?: string; // може бути, а може не бути
};

function greet(profile: Profile) {
  const displayName = profile.nickname ?? profile.name; // ?? = fallback, якщо undefined/null
  console.log(`Hello, ${displayName}`);
}
greet({ name: "Oleh" }); // ok, nickname відсутній
greet({ name: "Oleh", nickname: "Oleg" }); // ok

/**
 * 4. `readonly` — поле можна прочитати, але не можна перезаписати ПІСЛЯ
 *    створення об'єкта. Це захист на етапі компіляції (в рантаймі JS
 *    ніяк не заважає, це суто підказка для TS/тебе).
 */

type Point = {
  readonly x: number;
  readonly y: number;
};

const p: Point = { x: 0, y: 0 };
console.log(p);
// p.x = 5; // ПОМИЛКА: Cannot assign to 'x' because it is a read-only property

/**
 * 5. Об'єкти можуть бути вкладеними, і масив об'єктів типізується так само,
 *    як масив чого завгодно: `Type[]`.
 */

type Address = {
  city: string;
  street: string;
};

type Employee = {
  name: string;
  address: Address; // вкладений тип
};

const employees: Employee[] = [
  { name: "Ann", address: { city: "Lviv", street: "Franka" } },
];
console.log(employees);

/**
 * ==========================================================================
 * ТВОЄ ЗАВДАННЯ
 * ==========================================================================
 *
 * 1. Створи type `Book` з полями:
 *      - title: string
 *      - author: string
 *      - year: number
 *      - isbn?: string          (не в кожної книги він відомий)
 *      - readonly id: number    (id не можна змінювати після створення)
 *
 * 2. Напиши функцію `printBook(book: Book): string`, яка повертає рядок
 *    формату:  "Дюна (1965) — Frank Herbert"
 *    Якщо isbn присутній — додай його в кінці через ", ISBN: <isbn>".
 *
 * 3. Створи масив `library: Book[]` з 3+ книгами, хоча б в однієї
 *    задай isbn, в інших — не задавай.
 *
 * 4. Спробуй (закоментованим рядком) присвоїти нове значення `id` вже
 *    створеній книзі з масиву — переконайся, що TS видає помилку
 *    (`book.id = 999`), і залиш цей рядок закоментованим з поясненням,
 *    чому це помилка.
 *
 * Пиши код нижче.
 */

// 1.
type Book = {
  title: string;
  author: string;
  year: number;
  isbn?: string;
  readonly id: number;
}

// 2.
function printBook(book: Book): string {
  const mainText = `${book.title} (${book.year}) — ${book.author}`
  if (book.isbn) return mainText + `, ISBN: ${book.isbn}`
  else return mainText
}

console.log(printBook ({
  title: "Дюна",
  author: "Frank Herbert",
  year: 1965,
  id: 1
}))

console.log(printBook ({
  title: "Дюна",
  author: "Frank Herbert",
  year: 1965,
  isbn: "What?",
  id: 1
}))
// 3.

let library: Book[] = [{
  title: "Гаррі Поттер",
  author: "Джоан Роулінг",
  year: 2002,
  isbn: "Lumus",
  id: 2
}, {
  title: "Як вивчити Тайпскріпт",
  author: "Claude Code",
  year: 2026,
  id: 3
}, {
  title: "Сонце",
  author: "Темна Жаба",
  year: 200,
  id: 4
}
]

library.forEach((book) => console.log(printBook(book)));

// 4.

// library[0].id = 999;
// ПОМИЛКА TS2540: Cannot assign to 'id' because it is a read-only property.
// readonly дозволяє прочитати book.id, але забороняє змінювати його
// після того, як об'єкт вже створений.
