/**
 * ВПРАВА 3 — Discriminated Unions (типи з "тегом") + звуження типів (narrowing)
 *
 * ==========================================================================
 * ТЕОРІЯ
 * ==========================================================================
 *
 * Проблема: уяви, що ти описуєш результат запиту до сервера. Він може бути
 * в одному з кількох СТАНІВ, і в кожному стані є РІЗНІ поля:
 *   - loading  -> взагалі без даних
 *   - success  -> є `data`
 *   - error    -> є `message`
 *
 * Наївний підхід — зробити всі поля опціональними в одному типі:
 */

type BadState = {
  status: "loading" | "success" | "error";
  data?: string;
  message?: string;
};

function renderBad(state: BadState) {
  if (state.status === "success") {
    // Проблема: TS тут НЕ знає, що data точно є, бо технічно
    // status і data — незалежні поля. TS вважає data: string | undefined,
    // навіть якщо ЛОГІЧНО ми знаємо, що при success вона завжди є.
    console.log(state.data?.toUpperCase());
  }
}
void renderBad;

/**
 * РІШЕННЯ — Discriminated Union: замість одного типу з опціональними
 * полями робимо СОЮЗ (union) кількох ОКРЕМИХ типів, кожен зі своїм
 * "тегом" (discriminant) — полем з literal-типом, яке в кожному варіанті
 * своє власне значення:
 */

type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: string };
type ErrorState = { status: "error"; message: string };

type RequestState = LoadingState | SuccessState | ErrorState;

/**
 * Тепер магія: якщо перевірити поле-тег через `if` або `switch`,
 * TS АВТОМАТИЧНО звужує (narrows) тип всередині гілки —
 * і ти отримуєш доступ ТІЛЬКИ до полів, які там реально існують,
 * без `?.` і без `undefined`.
 */

function render(state: RequestState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      // тут TS ЗНАЄ: state — це SuccessState, отже state.data існує напевно
      return `Data: ${state.data.toUpperCase()}`;
    case "error":
      // тут TS ЗНАЄ: state — це ErrorState
      return `Error: ${state.message}`;
  }
}

console.log(render({ status: "loading" }));
console.log(render({ status: "success", data: "hello" }));
console.log(render({ status: "error", message: "oops" }));

/**
 * Бонус: якщо в `switch` не буде гілки на якийсь випадок, і ти додаси
 * `default` з `never`, TS попередить тебе, якщо пізніше додаси новий
 * варіант у union і забудеш його обробити (exhaustiveness check):
 *
 *   default: {
 *     const _exhaustive: never = state;
 *     throw new Error(`Unhandled: ${_exhaustive}`);
 *   }
 *
 * Спробуємо це в завданні.
 *
 * ==========================================================================
 * ТВОЄ ЗАВДАННЯ
 * ==========================================================================
 *
 * Змоделюй фігури (shapes) для обчислення площі.
 *
 * 1. Створи discriminated union `Shape` з трьома варіантами (кожен —
 *    окремий `type` з полем `kind` як тегом):
 *      - Circle:    kind: "circle",    radius: number
 *      - Rectangle: kind: "rectangle", width: number, height: number
 *      - Triangle:  kind: "triangle",  base: number, height: number
 *
 * 2. Напиши функцію `area(shape: Shape): number`, яка через `switch`
 *    по `shape.kind` рахує площу:
 *      - circle:    Math.PI * radius ** 2
 *      - rectangle: width * height
 *      - triangle:  (base * height) / 2
 *    Додай `default` гілку з exhaustiveness check (`const x: never = shape`),
 *    щоб TS підказав, якщо ти забудеш обробити якийсь варіант.
 *
 * 3. Створи масив `shapes: Shape[]` з кількома фігурами різних видів
 *    і вивести в консоль площу кожної (`shapes.forEach(...)`).
 *
 * 4. Експеримент (закоментований код): додай в union новий варіант,
 *    наприклад `Square` (kind: "square", side: number), але НЕ додавай
 *    його обробку в `switch`. Подивись на помилку в `default`-гілці
 *    (exhaustiveness check спрацює!), а тоді знову приберись —
 *    поверни код до робочого стану (можна видалити експеримент або
 *    залишити закоментованим з поясненням, що побачив).
 *
 * Пиши код нижче.
 */

// 1.
type Circle = {kind: "circle", radius: number}
type Rectangle = {kind: "rectangle", width: number, height: number}
type Triangle = {kind: "triangle", base: number, height: number}
type Square = {kind: "square", side: number}

type Shape = Circle | Rectangle | Triangle | Square

// 2.

function area(shape: Shape): number {
  switch(shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.height * shape.width;
    case "triangle":
      return (shape.base * shape.height) / 2;
    case "square":
      return shape.side ** 2;
    default: {
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
    }
  }
}

// 3.

let shapes: Shape[] = [{
  kind: "circle",
  radius: 6
}, {
  kind: "rectangle",
  width: 64,
  height: 6
}, {
  kind: "triangle",
  base: 8,
  height: 10
}]

shapes.forEach((item) => console.log(area(item)))

// 4.
// Експеримент: додав `Square` у `Shape`, не обробивши "square" у switch.
// Отримав: TS2322 "Type 'Square' is not assignable to type 'never'"
// саме в default-гілці — exhaustiveness check спрацював.
// Тепер case "square" доданий вище, і Shape/area знову узгоджені.
