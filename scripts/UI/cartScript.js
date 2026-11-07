import {FillFlowersAdd,FillTextOrder} from './script.js';
import addresses from '../../data/addresses.json' with { type: 'json' };

// Списки адресов 
const citySelect = document.querySelector("select[name='city']");
const streetSelect = document.querySelector("select[name='street']");
const houseSelect = document.querySelector("select[name='house']");

for (const city of Object.keys(addresses)) {
    citySelect.add(new Option(city, city));
}

citySelect.addEventListener("change", function () {
    streetSelect.options.length = 1;
    houseSelect.options.length = 1;
    streetSelect.disabled = !citySelect.value;
    houseSelect.disabled = true;

    if (!citySelect.value) return;

    for (const street of Object.keys(addresses[citySelect.value])) {
        streetSelect.add(new Option(street, street));
    }
});

streetSelect.addEventListener("change", function () {
    houseSelect.options.length = 1;
    houseSelect.disabled = !streetSelect.value;

    if (!streetSelect.value) return;

    for (const house of addresses[citySelect.value][streetSelect.value]) {
        houseSelect.add(new Option(house, house));
    }
});

//Маска ввода телефона
$("input[name='phone']").mask("+7(000)000-00-00");

//Корзина элементы
var divList=document.getElementById("OrderList");
//Фактические элементы, которые надо добавить в корзину
var order= JSON.parse(localStorage.getItem("flowerOrder"))|| [];;
//console.log("order",order);

//Стартовое заполнение отображения
FillFlowersAdd(divList,order);

//событие навесить на кнопки
$(divList).on("click", "button[data-id='minus']", MinusNumber);
$(divList).on("click", "button[data-id='plus']", PlusNumber);

function PlusNumber(event) {
    let button = event.target;
    //Ближайший родитель
    let card = button.closest(".cartItem");
    let idFlower=card.dataset.id;

    order.push(order.find(fl=>fl.Id==idFlower));

    UpdateOrder();
    UpdateTextOrder()
}

function MinusNumber(event) {
    let button = event.target;
    //Ближайший родитель
    let card = button.closest(".cartItem");
    let idFlower=card.dataset.id;
    //находим индекс с конца и срезаем последнюю
    const index = order.findLastIndex(fl => fl.Id == idFlower);

    if (index !== -1) { order.splice(index, 1);}

    UpdateOrder();
    UpdateTextOrder()
}
function UpdateOrder() {
    FillFlowersAdd(divList, order);
    localStorage.setItem("flowerOrder", JSON.stringify(order));
}
var divTextOrder=document.getElementById("divTextOrder");

console.log("divTextOrder",divTextOrder)
//поля заказа
UpdateTextOrder();
function UpdateTextOrder()
{
    console.log("---UpdateTextOrder---");
    let price=0;
    FillTextOrder(divTextOrder,order);
    for(let i=0;i<order.length;i++) 
        {
            price+=order[i].Price;
        }
    $("#resultPrice").text(price);   
}

//кнопка отправки формы
var orderForm = document.getElementById("orderForm");
orderForm.addEventListener("submit", SendForm);



function Reset() {
    // Очищаем массив заказов
    order = [];

    // Очищаем localStorage
    localStorage.setItem("flowerOrder", JSON.stringify(order));
    // Обновляем отображение корзины
    UpdateOrder();
    UpdateTextOrder();
}

var xht=new XMLHttpRequest();

function SendForm(event) {
    event.preventDefault();
    console.log("---SendForm---");
    //Запрос готовим 
    xht.open("POST", "http://127.0.0.1:3000/order", true);
    //что делать когда придет запрос
    xht.onload = function () {
        //Делаем проверку, если запись успешна - обновляем
        if (xht.status === 200) {
        //чтобы очищался только после успех
            Reset();
        } else {
            console.error("Заказ не сохранён:", xht.responseText);
        }

    }
    const items = [];
    for (let i = 0; i < order.length; i++) {
        const flower = order[i];
        const item = items.find(item => item.flowerId === flower.Id);

        if (item) item.quantity++;
        else items.push({ flowerId: flower.Id, quantity: 1 });

    }
    const formData = new FormData(orderForm);
    //Добавляем к форме заказы
    formData.append("items", JSON.stringify(items))

    //Отправляем просьбу записать заказы
    xht.send(formData);
}
