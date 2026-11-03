import {fillFlowersList, filterFlowersByCategory,updateFlowersList,filterFlowersByPrice} from './script.js';

var flowersDivCatalog = document.getElementById("flowersDivCatalog");
//тут объекты
var startFlowerList=fillFlowersList(flowersDivCatalog);
var flowersList = startFlowerList;
//массив условий типа цветов .get() сделает массивом обычным
var arFilterCategory=[]

$("button[name='Reset']").on("click",Reset);

var listPrices=$("input[name='price']").on("change",function(){
    Filter(this);
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
    
});

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
    arFilterCategory= FindCategory();
    console.log("arFilterCategory:",arFilterCategory);
    console.log("---");

    return filterFlowersByCategory(arFilterCategory);
}

function FindCategory()
{
    console.log("сработал FindCategory");
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

function Filter(obj)
{
    //Задача метода, определить фильтры и вызвать необходимые методы
    //Вызывается для каждого чека отдельно
    let checkCategory=true;
    let checkPrice=true;

    //Массив, в котором будут значения поиска
    let flowersBuffer=[];
 
    


    if(checkCategory)
    {
        //console.log("---checkCategory--- ")
        flowersBuffer=(FilterCategory(obj)).slice();
        //console.log("flowersList: ",flowersList)
        //console.log("flowersBuffer: ",flowersBuffer)
        //Если категории пустые и при этом пустое отображение -стартовые значения
        if(flowersBuffer.length==0&&arFilterCategory.length==0)
            flowersBuffer=startFlowerList;  
        //console.log("FilterCategory вернул",flowersList)
    }

    if (checkPrice) {
        console.log("---checkPrice--- ")
        console.log("flowersBuffer: ", flowersBuffer)
        flowersBuffer = FilterPrice(flowersBuffer);
    }

    flowersList=flowersBuffer;
    updateFlowersList(flowersDivCatalog,flowersList);

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