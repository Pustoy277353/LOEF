// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const minWeight = document.querySelector('.minweight__input'); // поле с мин весом
const maxWeight = document.querySelector('.maxweight__input'); // поле с макс весом
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('#color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// список цветов в JSON формате
let friutsColorJSON = `{
    "фиолетовый": "fruit_violet",
    "зеленый": "fruit_green",
    "розово-красный": "fruit_carmazin",
    "желтый": "fruit_yellow",
    "светло-коричневый": "fruit_lightbrown"
}`;

let priority = ["желтый", "зеленый", "фиолетовый", "светло-коричневый", "розово-красный"];

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
let friutsColor = JSON.parse(friutsColorJSON);

// Клонируем массив фруктов для последующего сравнения
const cloneFruits = Array.from(fruits);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = "";
  
  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    let fruitsItem = document.createElement("li")
    fruitsItem.classList.add("fruit__item", `${friutsColor[[fruits[i].color]]}`);
    fruitsItem.innerHTML = `
      <div class="fruit__info">
        <div>index: ${i}</div>
        <div>kind: ${fruits[i].kind}</div>
        <div>color: ${fruits[i].color}</div>
        <div>weight (кг): ${fruits[i].weight}</div>
      </div>
    `; 
    fruitsList.appendChild(fruitsItem);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  let i = 0;
  
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива

    result.splice(i, 0, fruits.splice(getRandomInt(0, fruits.length-1), 1)[0]);
    i++;
  }
  if (JSON.stringify(cloneFruits) == JSON.stringify(result)) {
    alert("Порядок не изменился");
  }
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  let fruitsFilter;
  fruits = cloneFruits;
  if ( (!!minWeight.value && !isNaN(minWeight.value)) && (!!maxWeight.value && !isNaN(maxWeight.value))) {
    fruitsFilter = fruits.filter((item) => {
      // TODO: допишите функцию
      return minWeight.value <= item.weight && item.weight <= maxWeight.value;
      
    });
    fruits = fruitsFilter;
  }
  return fruits;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  return priority.indexOf(a.color) > priority.indexOf(b.color);
};

const sortAPI = {

  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком

    const n = arr.length;
    for (let i = 0; i < n-1; i++) { 
        for (let j = 0; j < n-1-i; j++) { 
            if (comparation(arr[j], arr[j+1])) { 
                let temp = arr[j+1]; 
                arr[j+1] = arr[j]; 
                arr[j] = temp; 
            }
        }
    }

  },

  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки
    
    if (arr.length < 2) {
      return arr;
    }
  
    const index = Math.floor(arr.length / 2);
    const currentItem = arr[index];
    const more = [];
    const less = [];

    for (let i = 0; i < arr.length; i++) {

        if (i === index) {
            continue;
        }

        if (comparation(arr[i], currentItem)) {
            more.push(arr[i]);
        } else {
            less.push(arr[i]);
        }
    }

    fruits = [...sortAPI.quickSort(less, comparation), currentItem, ...sortAPI.quickSort(more, comparation)];
    return fruits;
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  if ((sortKindLabel.textContent = sortKind) == 'bubbleSort') {
      sortKind = 'quickSort';
      sortKindLabel.textContent = sortKind;
      return sortKind
  } else {
      sortKind = 'bubbleSort';
      sortKindLabel.textContent = sortKind;
      return sortKind
  }
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput

  function AddFruit (kind, color, weight) {
    this.kind = kind.value;
    this.color = color.value;
    this.weight = weight.value;
  }

  const fruit = new AddFruit(kindInput, colorInput, weightInput);

  if ((fruit.kind == "") || (fruit.color == "") || (fruit.weight == "")) {
    return alert("заполните все поля для добавления фрукта");
  }

  fruits.push(fruit);
  cloneFruits.push(fruit);
  kindInput.value = "";
  colorInput.value = "";
  weightInput.value = "";
  display();
});