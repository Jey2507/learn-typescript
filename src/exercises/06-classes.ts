/**
 * ВПРАВА 6 — Класи: поля, модифікатори доступу, interface + implements,
 *            успадкування (extends), abstract class
 *
 * ==========================================================================
 * ЗАУВАЖЕННЯ ПРО ЦЕЙ ПРОЄКТ (важливо, інакше отримаєш дивні помилки)
 * ==========================================================================
 *
 * У tsconfig.json цього проєкту увімкнено `erasableSyntaxOnly: true`.
 * Це забороняє дві речі, які ти можеш зустріти в туторіалах:
 *   - "parameter properties" — скорочений запис `constructor(private x: string)`
 *   - `enum`
 * Причина: обидві штуки генерують РЕАЛЬНИЙ JS-код (не тільки типи), а
 * `erasableSyntaxOnly` вимагає, щоб типи можна було просто "стерти" й
 * отримати чистий JS без допомоги компілятора TS (так працюють швидкі
 * інструменти на кшталт esbuild). Тому нижче ми завжди пишемо поле
 * окремо і присвоюємо його в тілі конструктора — це трохи більше коду,
 * зате явно видно кожен крок.
 *
 * ==========================================================================
 * ТЕОРІЯ
 * ==========================================================================
 *
 * 1. Базовий клас: поля + конструктор + метод.
 *    Клас — це "шаблон" для створення об'єктів (`new ClassName(...)`).
 */

class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name; // this.поле = те, що передали в конструктор
    this.age = age;
  }

  greet(): string {
    return `Hi, I'm ${this.name}, ${this.age} y.o.`;
  }
}

const alice = new Person("Alice", 30);
console.log(alice.greet());

/**
 * 2. Модифікатори доступу: `public` (за замовчуванням), `private`, `protected`.
 *
 *    - public    — доступне звідусіль (це стандартна поведінка, як вище).
 *    - private   — доступне ТІЛЬКИ всередині цього самого класу.
 *    - protected — доступне всередині класу І в класах-нащадках (extends),
 *                  але НЕ ззовні.
 */

class BankAccount {
  private balance: number; // ніхто ззовні не читає/змінює напряму

  constructor(startBalance: number) {
    this.balance = startBalance;
  }

  deposit(amount: number): void {
    this.balance += amount; // ok, ми ВСЕРЕДИНІ класу
  }

  getBalance(): number {
    return this.balance; // єдиний "офіційний" спосіб дізнатись баланс ззовні
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
// account.balance; // ПОМИЛКА: 'balance' is private, доступне лише в класі

// Навіщо це: захист від того, щоб хтось випадково написав
// `account.balance = -99999` десь у далекому куточку коду. `private`
// змушує міняти стан ТІЛЬКИ через методи класу (тут — deposit),
// де можна додати перевірки (наприклад, заборонити від'ємні суми).

/**
 * 3. `readonly` у класах — так само, як у звичайних object types (вправа 2),
 *    тільки тепер це поле класу. Можна присвоїти значення лише один раз —
 *    або одразу при оголошенні, або в конструкторі.
 */

class Ticket {
  readonly id: number;
  status: "open" | "closed";

  constructor(id: number) {
    this.id = id; // ок, це ще "перше" присвоєння (в конструкторі дозволено)
    this.status = "open";
  }
}

const ticket = new Ticket(1);
// ticket.id = 999; // ПОМИЛКА: readonly
ticket.status = "closed"; // ok, status не readonly
console.log(ticket);

/**
 * 4. `interface` + `implements` — контракт, який клас ЗОБОВ'ЯЗАНИЙ виконати.
 *    Interface описує, ЯКІ методи/поля повинні бути в класі, а сам клас
 *    вирішує, ЯК саме вони працюють. Якщо забудеш реалізувати щось з
 *    інтерфейсу — TS одразу вкаже помилку (як з невиконаним switch у вправі 3).
 */

interface Greetable {
  greet(): string;
}

class Robot implements Greetable {
  greet(): string {
    return "BEEP BOOP HELLO";
  }
  // якби я не написав greet() — TS видав би помилку:
  // "Class 'Robot' incorrectly implements interface 'Greetable'"
}

console.log(new Robot().greet());

/**
 * 5. Успадкування (`extends` + `super`) — новий клас бере ВСЕ від
 *    "батьківського" і може додати своє або перевизначити (override) методи.
 *    `super(...)` викликає конструктор батьківського класу — це ОБОВ'ЯЗКОВО,
 *    якщо в нащадка є власний конструктор.
 */

class Employee extends Person {
  role: string;

  constructor(name: string, age: number, role: string) {
    super(name, age); // спершу викликаємо конструктор Person — заповнює name/age
    this.role = role; // потім додаємо своє власне поле
  }

  // override: та сама назва методу, нова поведінка
  greet(): string {
    return `${super.greet()} I work as ${this.role}.`;
    // super.greet() викликає ОРИГІНАЛЬНИЙ метод з Person, а ми його доповнюємо
  }
}

const bob = new Employee("Bob", 40, "developer");
console.log(bob.greet()); // "Hi, I'm Bob, 40 y.o. I work as developer."

/**
 * 6. `abstract class` — "недобудований" клас, який НЕ можна створити напряму
 *    (`new Shape()` — помилка). Він задає СПІЛЬНУ логіку і ЗМУШУЄ нащадків
 *    реалізувати конкретні методи (`abstract method` — тільки сигнатура,
 *    без тіла, як у interface, але саме в класі).
 */

abstract class Shape {
  abstract area(): number; // КОЖЕН нащадок МУСИТЬ це реалізувати

  describe(): string {
    // звичайний метод — спільний для ВСІХ нащадків, готовий одразу
    return `Area is ${this.area()}`;
  }
}

class Square extends Shape {
  side: number;
  constructor(side: number) {
    super();
    this.side = side;
  }
  area(): number {
    return this.side ** 2;
  }
}

// const s = new Shape(); // ПОМИЛКА: Cannot create an instance of an abstract class
const square = new Square(4);
console.log(square.describe()); // "Area is 16" — describe() взятий з батька,
// area() — власна реалізація Square

/**
 * ==========================================================================
 * ТВОЄ ЗАВДАННЯ
 * ==========================================================================
 *
 * Змоделюй систему співробітників з бонусами.
 *
 * 1. Створи `abstract class StaffMember`:
 *      - protected readonly name: string
 *      - protected salary: number
 *      - конструктор приймає (name: string, salary: number) і заповнює поля
 *      - abstract method `calculateBonus(): number`
 *      - звичайний метод `describe(): string`, що повертає рядок формату:
 *        "Alice earns 1000 + bonus 100" (bonus береться через
 *        `this.calculateBonus()`)
 *
 * 2. Створи `class Manager extends StaffMember`:
 *      - додаткове поле `teamSize: number`
 *      - конструктор приймає (name, salary, teamSize), викликає super(...)
 *      - `calculateBonus()`: повертає `salary * 0.2` (менеджерський бонус 20%)
 *
 * 3. Створи `class Developer extends StaffMember`:
 *      - `calculateBonus()`: повертає `salary * 0.1` (бонус розробника 10%)
 *      - (додаткових полів не треба)
 *
 * 4. Створи `interface Reportable { report(): string }`.
 *    Зроби так, щоб `Manager implements Reportable` — додай метод
 *    `report(): string`, що повертає, наприклад,
 *    "Alice manages a team of 5".
 *
 * 5. Створи масив `staff: StaffMember[]` з кількома Manager і Developer,
 *    і виведи в консоль `describe()` кожного через `forEach`
 *    (це поліморфізм: кожен викликає СВОЮ версію `calculateBonus()`,
 *    хоча код виклику однаковий для всіх).
 *
 * 6. Спробуй (закоментованим рядком) `new StaffMember("X", 100)` —
 *    переконайся, що TS видає помилку, бо клас abstract, і залиш
 *    коментар з поясненням.
 *
 * Пиши код нижче.
 */

// 1.


// 2.


// 3.


// 4.


// 5.


// 6.
