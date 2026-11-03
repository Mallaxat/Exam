import {fillFlowersList, filterFlowersByCategory,updateFlowersList,filterFlowersByPrice} from './script.js';

var flowersDivCatalog = document.getElementById("flowersDivCatalog");
//тут объекты
var startFlowerList=fillFlowersList(flowersDivCatalog);
var flowersList = startFlowerList;
//массив условий типа цветов .get() сделает массивом обычным
var arFilterCategory=[]

$("button[name='Reset']").on("click",Reset);

//Базовый фильтр
//это массив элементов
//0-дешевле 1- дороже
var globalFilter=document.getElementById("aria_sort");
var select = globalFilter.value;

var listPrices=$("input[name='price']").on("change",function(){
    Filter(this);
    Sort(select);
}); 
//К событию смены чека привязываем функцию
var listChecked=$("input[name='flower']").on("change", function()
{
    console.log("изменен",this.value)
    //Передаем текущий объект в фильтр
    //Если чек был снят, то убираем его из категорий
    if(this.checked==false && arFilterCategory.includes(this.value))
    {
        let index=arFilterCategory.indexOf(this.value);
        if(index>=0) arFilterCategory.splice(index,1);
    }
    Filter(this);
    Sort(select);
    
});
globalFilter.addEventListener("change",function()
{
    select = globalFilter.value;
    console.log("select",select);
    Sort(select);
});

Sort(select);
function Sort(sortCheck) {
    console.log("sortCheck", sortCheck);

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
function FilterCategory(obj)
{
    console.log("сработал filterCategory")
    arFilterCategory = FindCategory();
    console.log("arFilterCategory:",arFilterCategory);
    console.log("---");

    return filterFlowersByCategory(arFilterCategory);
}

function FindCategory()
{
    //console.log("сработал FindCategory");
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

function Filter(obj) {
    //Задача метода, определить фильтры и вызвать необходимые методы
    //Вызывается для каждого чека отдельно
    let checkPrice = listPrices[0].value !== "" || listPrices[1].value !== "";

    //Массив, в котором будут значения поиска
    let flowersBuffer = [];

    //Сверка по категории
    flowersBuffer = (FilterCategory(obj)).slice();
    //Если категории пустые и при этом пустое отображение -стартовые значения
    if (flowersBuffer.length == 0 && arFilterCategory.length == 0)
        flowersBuffer = startFlowerList;

    if (checkPrice) {
        flowersBuffer = FilterPrice(flowersBuffer);
    }
    //Проверка если это авторский или моно букет

    flowersList = flowersBuffer;
    updateFlowersList(flowersDivCatalog, flowersList);

}
function Reset()
{
    console.log("Сработал Reset");
    for(let i=0;i<listChecked.length;i++)
    {
        listChecked[i].checked=false;
    }
    flowersList=startFlowerList;
    listPrices[0].value = "";
    listPrices[1].value = "";
    arFilterCategory = [];
    updateFlowersList(flowersDivCatalog,flowersList);
}