class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }

    setAvailable(available) {
        this.available = available;
    }
}

class GoodsList {
    #goods;
    constructor(filter, sortPrice, sortDir) {
        this.#goods = [];
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }

    get list() {
        const resultList = this.#goods.filter(good => this.filter.test(good.name));

        if (!this.sortPrice) {
            return resultList;
        }

        if (this.sortDir) {
            return resultList.sort((first, second) => (first.price - second.price));
        }
        return resultList.sort((first, second) => (second.price - first.price));
    }

    add(new_item) {
        this.#goods.push(new_item);
    }

    remove(id) {
        const id_good = this.#goods.findIndex(goods => goods.id === id);
        if (id_good >= 0) {
            this.#goods.splice(id_good, 1);
        }
        return id_good;
    }
}

class BasketGood extends Good {
    constructor(id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available, amount);
        this.amount = amount;
    }
}

class Basket {
    constructor(goods) {
        this.goods = [];
    }

    get totalAmount() {
        return this.goods.reduce((first, second) => first + second.amount * second.price, 0);
    }

    get totalSum() {
        return this.goods.map(item => item.amount).reduce((first, second) => first + second, 0)
    }

    add(good, amount) {
        const item_index = this.goods.findIndex(goods => goods.id === good.id);
        if (item_index >= 0) {
            this.goods[item_index].amount += amount;
        } else {
            const newgood = new BasketGood(good.id, good.name, good.description, good.sizes, good.price, good.available, amount);
            this.goods.push(newgood);
        }
    }

    remove(good, amount) {
        const good_index = this.goods.findIndex(goods => goods.id === good.id)
        if (good_index >= 0) {
            if (this.goods[good_index].amount - amount <= 0 || amount === 0) {
                this.goods.splice(good_index, 1);
            } else {
                this.goods[good_index].amount -= amount;
            }
        }
    }

    clear() {
        this.goods.length = 0;
    }

    removeUnavailable() {
        this.goods = this.goods.filter(good => good.available === true);
    }
}

const item_1 = new Good(1, "Апельсины", "Апельсины развесные", [250, 500, 1000], 100, true);
const item_2 = new Good(2, "Яблоки", "Яблоки сезонные", [250, 500, 1000], 200, true);
const item_3 = new Good(3, "Мандарины", "Мандарины южные", [250, 500, 1000], 300, false);
const item_4 = new Good(4, "Бананы", "Бананы спелые", [250, 500, 1000], 400, true);
const item_5 = new Good(5, "Груши", "Груши краснодарские", [250, 500, 1000], 500, true);
const item_6 = new Good(6, "Сливы", "Сливы восточные", [250, 500, 1000], 600, true);
const item_7 = new Good(7, "Персики", "Персики сладкие", [250, 500, 1000], 700, false);
const item_8 = new Good(8, "Нектарины", "Нектарины с мякотью без косточки", [250, 500, 1000], 800, false);

item_5.setAvailable(false);
item_7.setAvailable(true);

regexp  = /[а-яё]/i;

const catalog = new GoodsList(regexp, true, true);

catalog.filter = regexp;
catalog.sortPrice = true;
catalog.sortDir = true;

catalog.add(item_1);
catalog.add(item_2);
catalog.add(item_3);
catalog.add(item_4);
catalog.add(item_5);
catalog.add(item_6);
catalog.add(item_7);
catalog.add(item_8);

catalog.remove(6);
catalog.remove(8);

console.log("Каталог товаров со свойствами:", catalog.list);

const basket = new Basket();

basket.add(item_1, 10);
basket.add(item_3, 5);
basket.add(item_4, 5);
basket.add(item_7, 7);

basket.remove(item_4, 5);
basket.remove(item_7, 5);

console.log("Общее количество товаров в корзине: ", basket.totalSum);
console.log("Общая стоимость товаров в корзине: ", basket.totalAmount);
console.log(basket);

basket.removeUnavailable();

console.log("Общее количество доступных товаров в корзине: ", basket.totalSum);
console.log("Общая стоимость доступных товаров в корзине: ", basket.totalAmount);

basket.clear();

console.log("Пустая корзина: ", basket);