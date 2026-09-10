/**
 * ВПРАВА 5 — Utility Types: Partial, Required, Readonly, Pick, Omit, Record
 *
 * ==========================================================================
 * ТЕОРІЯ
 * ==========================================================================
 *
 * Ідея цієї теми проста: ти вже вмієш писати generic-функції й типи
 * (`function first<T>(arr: T[])`, `type Box<T> = { value: T }`).
 * Utility types — це просто ГОТОВІ generic-типи, які TS уже написав
 * за тебе і вбудував у мову. Тобі не треба їх імпортувати — вони завжди
 * доступні. Кожен вирішує одну повторювану задачу: "візьми ІСНУЮЧИЙ тип
 * і зроби з нього трохи ІНШИЙ тип, не переписуючи все з нуля".
 *
 * Working приклад через весь розділ — один базовий тип:
 */

type Product = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
};

/**
 * 1. `Partial<T>` — робить УСІ поля опціональними (`?`).
 *
 *    Навіщо: уяви функцію "оновити товар", куди передають лише ті поля,
 *    що змінились (наприклад, тільки нову ціну). Писати окремий тип
 *    з усіма `?` вручну — дублювання. `Partial<Product>` робить це за тебе.
 */

type ProductPatch = Partial<Product>;
// Це те саме, що вручну написати:
// type ProductPatch = { id?: number; name?: string; price?: number; inStock?: boolean };

function applyPatch(product: Product, patch: ProductPatch): Product {
  return { ...product, ...patch }; // spread: patch перезаписує тільки передані поля
}

const p1: Product = { id: 1, name: "Book", price: 100, inStock: true };
const p2 = applyPatch(p1, { price: 90 }); // міняємо тільки ціну
console.log(p2);

/**
 * 2. `Required<T>` — протилежність: робить УСІ поля ОБОВ'ЯЗКОВИМИ,
 *    навіть якщо в оригінальному типі були `?`. Корисно, коли, наприклад,
 *    після застосування дефолтних значень ти ГАРАНТУЄШ, що все заповнено.
 */

type MaybeProduct = { id: number; name?: string; price?: number };
type FullProduct = Required<MaybeProduct>; // { id: number; name: string; price: number }
void (0 as unknown as FullProduct); // (тільки щоб показати тип, ігноруй цей рядок)

/**
 * 3. `Readonly<T>` — робить УСІ поля `readonly` (пригадай вправу 2!).
 *    Замість того, щоб вручну писати `readonly` перед кожним полем.
 */

type FrozenProduct = Readonly<Product>;
const frozen: FrozenProduct = { id: 2, name: "Pen", price: 10, inStock: true };
// frozen.price = 20; // ПОМИЛКА: readonly, як і в Point/Book раніше
console.log(frozen);

/**
 * 4. `Pick<T, Keys>` — бере ТІЛЬКИ перелічені поля з T, решту відкидає.
 *    `Keys` — це union з назв полів (рядки, розділені `|`), точнісінько
 *    як `keyof T`, яке ми вже бачили у вправі 4.
 */

type ProductPreview = Pick<Product, "id" | "name">; // { id: number; name: string }

function toPreview(product: Product): ProductPreview {
  return { id: product.id, name: product.name };
}
console.log(toPreview(p1));

/**
 * 5. `Omit<T, Keys>` — протилежність Pick: бере ВСІ поля, КРІМ перелічених.
 */

type ProductWithoutStock = Omit<Product, "inStock">; // без inStock

function hideStock(product: Product): ProductWithoutStock {
  const { inStock, ...rest } = product; // inStock свідомо "викидається"
  return rest;
}
console.log(hideStock(p1));

/**
 * 6. `Record<Keys, ValueType>` — будує тип "словника" (об'єкта, де ключі
 *    одного типу, а значення — іншого). Дуже зручно для мап
 *    "id -> об'єкт", "назва категорії -> список товарів" тощо.
 */

type ProductsById = Record<string, Product>; // { [key: string]: Product }

const catalog: ProductsById = {
  "1": p1,
  "2": { id: 2, name: "Pen", price: 10, inStock: true },
};
console.log(catalog["1"]); // доступ по ключу, TS знає, що це Product | ...
console.log(catalog["1"]?.name); // ?. на випадок, якщо такого ключа нема

/**
 * ==========================================================================
 * ТВОЄ ЗАВДАННЯ
 * ==========================================================================
 *
 * Працюємо з новим типом:
 *
 *   type Article = {
 *     id: number;
 *     title: string;
 *     content: string;
 *     author: string;
 *     published: boolean;
 *   };
 *
 * 1. Створи `ArticlePatch = Partial<Article>` і функцію
 *    `updateArticle(article: Article, patch: ArticlePatch): Article`
 *    (аналогічно `applyPatch` вище). Перевір на прикладі — онови лише
 *    `published` в існуючої статті.
 *
 * 2. Створи `ArticlePreview = Pick<Article, "id" | "title" | "author">`
 *    і функцію `toArticlePreview(article: Article): ArticlePreview`.
 *
 * 3. Створи `ArticleWithoutContent = Omit<Article, "content">`
 *    і функцію `hideContent(article: Article): ArticleWithoutContent`
 *    (використай прийом деструктуризації, як у `hideStock` вище).
 *
 * 4. Створи `type ArticlesById = Record<string, Article>` і об'єкт
 *    `articlesCatalog: ArticlesById` з 2-3 статтями (ключ — id як рядок).
 *    Виведи в консоль назву статті за ключем `"1"` через `?.`.
 *
 * Пиши код нижче.
 */

// 1.


// 2.


// 3.


// 4.
