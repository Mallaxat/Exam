import {FillFlowersAdd} from './script.js';

//Корзина элементы
var divList=document.getElementById("OrderList");
//Фактические элементы, которые надо добавить в корзину
var order= JSON.parse(localStorage.getItem("flowerOrder"));
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
}

function MinusNumber(event) {
        let button = event.target;
    //Ближайший родитель
    let card = button.closest(".cartItem");
    let idFlower=card.dataset.id;
    
    order.splice(order.findIndex(fl => fl.Id == idFlower), 1);

    UpdateOrder();
}
function UpdateOrder() {
    FillFlowersAdd(divList, order);
    localStorage.setItem("flowerOrder", JSON.stringify(order));
}