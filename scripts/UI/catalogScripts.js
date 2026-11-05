import {fillFlowersList, GetFlowers,updateFlowersList,FillFlowersType} from './script.js';

var flowersDivCatalog = document.getElementById("flowersDivCatalog");
//тут объекты
var startFlowerList=GetFlowers();
var flowersList = startFlowerList;

$("button[name='Reset']").on("click",Reset);

//Фильтр(Дороже/Дешевле)
//это массив элементов
//0-дешевле 1- дороже
var globalFilter=document.getElementById("aria_sort");
var select = globalFilter.value;
globalFilter.addEventListener("change",function()
{
    select = globalFilter.value;
    Sort(select);
});

//Фильтр Цена

var listPrices=$("input[name='price']").on("change",function(){
    Filter(this);
    Sort(select);
}); 
FillFlowersType(document.getElementById("flowerType"));
//Фильтр Категория
//К событию смены чека привязываем функцию
var listChecked = $("input[name='flower']").on("change", function () {

    if (this.checked == false) flowersList = startFlowerList;
    //Передаем текущий объект в фильтр
    Filter(this);
    Sort(select);
});


//Список кнопок
//Какая кнопка выбрана
var selectButton=$("#DivSelect>button")[0];
$("#DivSelect>button").on("click", function () {
    $("#DivSelect>button").removeClass("activeChip");
    $(this).addClass("activeChip");
    selectButton = this;
    Filter();
});

//Базовый запуск
fillFlowersList(flowersDivCatalog);
Sort(select);


function Sort(sortCheck) {

    if (Number(sortCheck) > 0) {
         flowersList.sort((fl1, fl2) =>Number(fl2.Price) - Number(fl1.Price));
      
    }
    else {
         flowersList.sort((fl1, fl2) =>Number(fl1.Price) - Number(fl2.Price));
    }

    updateFlowersList(flowersDivCatalog, flowersList);
}

//Фильтрация по прайсу
function FilterPrice(array) {
    let minPrice = Number(listPrices[0].value);
    let maxPrice = listPrices[1].value === ""? Infinity: Number(listPrices[1].value);
    return array.filter(flower =>Number(flower.Price) >= minPrice &&Number(flower.Price) <= maxPrice);
}
//Фильтрация по категории
function FilterCategory(array, callback) {

    let param = callback(); //[rose,tulp]
    if (param.length == 0) return array;
    return array.filter(fl => param.some(param => fl.Category.includes(param)));
}

function FindCategory()
{
    let FilterCategory=[];
    for(let i=0;i<listChecked.length;i++)
    {
        if(listChecked[i].checked==true)
        {
            FilterCategory.push(listChecked[i].value);
        }
    }
    return FilterCategory;
}

function FilterButton(array) {

    let flowersBuffer = array;
    switch (Number(selectButton.value)) {
        default:
            flowersBuffer = array;
            break;
        case 1:
            flowersBuffer = array.filter(fl => Number(fl.Type) == 0);
            break;
        case 2:
            flowersBuffer = array.filter(fl => Number(fl.Type) == 1);
            break;
    }
    return flowersBuffer;

}

function Filter(obj) {
    //Задача метода, определить фильтры и вызвать необходимые методы
    //Вызывается для каждого чека отдельно
    let checkPrice = listPrices[0].value !== "" || listPrices[1].value !== "";
    let checkButton = (selectButton.value > 0) ? true : false;
    //Массив, в котором будут значения поиска
    let flowersBuffer = startFlowerList;

    //Проверка если это авторский или моно букет
    if (checkButton) {
        flowersBuffer=FilterButton(flowersBuffer);

    }
    //Чек категорий
    flowersBuffer = FilterCategory(flowersBuffer, FindCategory);
    if(checkPrice)
    {
        flowersBuffer=FilterPrice(flowersBuffer);
    }

    flowersList=flowersBuffer;
    updateFlowersList(flowersDivCatalog, flowersList);

}
function Reset()
{
    for(let i=0;i<listChecked.length;i++)
    {
        listChecked[i].checked=false;
    }
    flowersList=startFlowerList;
    listPrices[0].value = "";
    listPrices[1].value = "";

    $("#DivSelect>button").removeClass("activeChip");
    $("#DivSelect > button[value='0']").addClass("activeChip");

    updateFlowersList(flowersDivCatalog,flowersList);
}

$("button.addOrder").on("click",AddOrder);
var flowerOrder=[];
window.addEventListener("pagehide", function() {
    console.log("pagehide");
    //Получаем корзина которая уже есть
    let oldOrder = JSON.parse(localStorage.getItem("flowerOrder")) || [];
    // Добавляем в неё новые товары
    flowerOrder.push(...oldOrder);
    localStorage.setItem("flowerOrder", JSON.stringify(flowerOrder));

});
function AddOrder(event) {
    let button = event.target;
    //поулчаем старые заказы
    //Если в корзине что-то было
    flowerOrder.push(flowersList.find(fl => Number(fl.Id) == Number(button.dataset.id)));
}

