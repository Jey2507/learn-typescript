/**
 * ВПРАВА 1 — Базові типи, union, literal types
 *
 * ТЕОРІЯ (коротко):
 * - TS сам виводить тип зі значення (inference): `let x = 5` -> x: number.
 *   Явна анотація (`let x: number`) потрібна, коли інференс неможливий
 *   або коли ти хочеш зафіксувати тип наперед (напр. для параметрів функцій).
 * - Union type `A | B` — значення може бути ОДНИМ із варіантів.
 * - Literal type — тип, що звужений до конкретного значення: `"success"`,
 *   а не просто `string`. Часто комбінують у union: `"success" | "error"`.
 *
 * ПРИКЛАД:
 */

function formatStatus(status: "success" | "error" | "pending"): string {
  if (status === "success") return "✅ Done";
  if (status === "error") return "❌ Failed";
  return "⏳ Waiting";
}

console.log(formatStatus("success"));
// formatStatus("done"); // <- буде помилка компіляції, "done" не входить у union

/**
 * ТВОЄ ЗАВДАННЯ:
 *
 * 1. Напиши функцію `describeTemperature(celsius: number): string`,
 *    яка повертає:
 *      - "Freezing"  якщо celsius <= 0
 *      - "Cold"      якщо 0 < celsius <= 15
 *      - "Warm"      якщо 15 < celsius <= 25
 *      - "Hot"       якщо celsius > 25
 *
 * 2. Створи type alias (`type Direction = ...`) для сторін світу:
 *    "north" | "south" | "east" | "west".
 *    Напиши функцію `opposite(direction: Direction): Direction`,
 *    що повертає протилежний напрямок.
 *
 * 3. Оголоси змінну `mixedList` — масив, який може містити
 *    ТІЛЬКИ числа і рядки (union у масиві: (number | string)[]),
 *    заповни її кількома значеннями обох типів.
 *
 * Пиши код нижче. Коли готово — скажи мені, я перевірю.
 */

// 1.

function describeTemperature(celsius:number): "Freezing" | "Cold" | "Warm" | "Hot" {
  if (celsius > 0 && celsius <= 15) return "Cold";
  if (celsius > 15 && celsius <= 25) return "Warm";
  if (celsius > 25) return "Hot";
  else return "Freezing";
}

console.log(describeTemperature(20))

// 2.

type Direction = "north" | "south" | "east" | "west"


function opposite(direction: Direction): Direction {
  if (direction === "north") return "south";
  if (direction === "east") return "west";
  if (direction === "west") return "east"
  else return "north";
}

console.log(opposite)
// 3.

let mixedList: ((number | string)[]) = [35, "fire", "nice", 9.4]

console.log(mixedList)