/**
 * ВПРАВА 4 — Generics + типізовані методи масивів (map/filter/find) + type predicates
 *
 * ==========================================================================
 * ТЕОРІЯ
 * ==========================================================================
 *
 * 1. ПРОБЛЕМА, яку вирішують generics.
 *    Уяви функцію, що повертає перший елемент масиву. Без generics
 *    довелось би або писати окрему функцію під кожен тип масиву,
 *    або використати `any` — і втратити типізацію взагалі:
 */

function firstBad(arr: any[]): any {
  return arr[0];
}
const badResult = firstBad([1, 2, 3]); // тип: any — TS вже нічого не знає
void badResult;

/**
 * РІШЕННЯ — generic-параметр `<T>`. Це як "змінна", але для типу,
 * а не для значення. TS виводить конкретний T з того, що ти передав,
 * і "протягує" цей тип через всю функцію:
 */

function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const n = first([1, 2, 3]); // T виведений як number -> n: number | undefined
const s = first(["a", "b"]); // T виведений як string -> s: string | undefined
console.log(n, s);

// Зверни увагу: повертає `T | undefined`, бо масив може бути порожнім —
// це чесніше, ніж прикидатись, що елемент завжди є.

/**
 * 2. Generic constraint (`extends`) — обмежуємо, ЯКИМ може бути T.
 *    Приклад: функція, що дістає значення поля з об'єкта за назвою ключа.
 *    `K extends keyof T` означає "K — це один із ключів типу T",
 *    тому TS перевірить, що ти передаєш існуючу назву поля, і правильно
 *    виведе тип значення цього поля.
 */
  
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

const users = [
  { name: "Ann", age: 20 },
  { name: "Bob", age: 25 },
];
const names = pluck(users, "name"); // string[]
const ages = pluck(users, "age"); // number[]
console.log(names, ages);
// pluck(users, "email"); // ПОМИЛКА: "email" не є ключем { name, age }

/**
 * 3. `map` / `filter` / `find` вже є generic-методами вбудованого типу Array<T>.
 *    Тому TS сам виводить типи в колбеках без жодних анотацій з твого боку:
 */

const doubled = [1, 2, 3].map((x) => x * 2); // x: number (виведено з масиву)
console.log(doubled);

/**
 * 4. Проблема `.filter()`: якщо фільтруєш union-тип (наприклад, наш
 *    Shape з попередньої вправи), звичайний filter НЕ звужує тип масиву:
 */

type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Shape = Circle | Square;

const shapes: Shape[] = [
  { kind: "circle", radius: 5 },
  { kind: "square", side: 3 },
];

const filteredBad = shapes.filter((s) => s.kind === "square");
void filteredBad;
// filteredBad має тип Shape[], а НЕ Square[], хоч ми точно знаємо,
// що тут лежать тільки квадрати. Тому s.side нижче викличе помилку:
// filteredBad[0].side; // ПОМИЛКА: Property 'side' does not exist on type 'Shape'

/**
 * РІШЕННЯ — type predicate: функція-охоронець (type guard), яка каже
 * TS "якщо я повернув true, то аргумент ТОЧНО цього типу".
 * Синтаксис: `function isX(arg): arg is X`.
 */

function isSquare(shape: Shape): shape is Square {
  return shape.kind === "square";
}

const squares = shapes.filter(isSquare); // тепер squares: Square[] !
console.log(squares[0].side); // ok, TS знає, що це Square

/**
 * ==========================================================================
 * ТВОЄ ЗАВДАННЯ
 * ==========================================================================
 *
 * 1. Напиши generic-функцію `last<T>(arr: T[]): T | undefined`,
 *    що повертає останній елемент масиву (аналогічно до `first`, але
 *    з кінця). Перевір на масиві чисел і на масиві рядків.
 *
 * 2. Використай `pluck` (він уже написаний вище) на масиві книг:
 *      const books = [
 *        { title: "Дюна", year: 1965 },
 *        { title: "1984", year: 1949 },
 *      ];
 *    Отримай масив назв (`pluck(books, "title")`) і масив років.
 *
 * 3. Створи union `Vehicle = Car | Bike`, де:
 *      Car:  { kind: "car"; wheels: 4; fuel: "petrol" | "electric" }
 *      Bike: { kind: "bike"; wheels: 2 }
 *    Напиши type predicate `isCar(v: Vehicle): v is Car`.
 *    Створи масив `vehicles: Vehicle[]` з кількома машинами і велосипедами,
 *    і за допомогою `vehicles.filter(isCar)` отримай масив `Car[]`,
 *    після чого виведи в консоль `fuel` кожної машини (без помилок типів —
 *    це має бути можливим тільки завдяки type predicate).
 *
 * 4. Використай `vehicles.find(isCar)` — зверни увагу, що результат має
 *    тип `Car | undefined` (a не просто `Car`), і ОБРОБИ цей undefined
 *    явною перевіркою (`if (car) { ... }`) перед використанням `car.fuel`.
 *
 * Пиши код нижче.
 */

// 1.
function last <T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

console.log(last([1, 2, 3, 4, 5, 6, 7]))
console.log(last(["a", "d", "f", "hi"]))

// 2.

const books = [
        { title: "Дюна", year: 1965 },
        { title: "1984", year: 1949 },
 ];
const nameBook = pluck(books, "title"); 
const year = pluck(books, "year"); 
console.log(nameBook, year);

// 3.

type Car = { kind: "car"; wheels: 4; fuel: "petrol" | "electric" }
type Bike = { kind: "bike"; wheels: 2 }
type Vehicle = Car | Bike

const vehicles: Vehicle[] = [
  { kind: "car", wheels: 4, fuel: "petrol" },
  { kind: "bike", wheels: 2 },
  { kind: "car", wheels: 4, fuel: "electric" },
];

function isCar(v: Vehicle): v is Car {
  return v.kind === "car"
}

const cars = vehicles.filter(isCar)
cars.forEach((c) => console.log(c.fuel))

// 4.

const foundCar = vehicles.find(isCar); // тип: Car | undefined

if (foundCar) {
  // тут TS звузив тип foundCar до Car (бо ми в блоці, де воно "правдиве")
  console.log(`Знайдена машина працює на: ${foundCar.fuel}`);
} else {
  console.log("Машину не знайдено");
}
