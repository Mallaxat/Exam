import {fillFlowersList, filterFlowersByCategory,updateFlowersList} from './script.js';

var flowersDivCatalog = document.getElementById("flowersDivCatalog");
//тут объекты
var startFlowerList=fillFlowersList(flowersDivCatalog);
var flowersList = startFlowerList;
var filterCategory=[];

$("input[name='flower']").on("change", function () {
    if (filterCategory.includes(this.value)) {
        filterCategory.splice(filterCategory.indexOf(this.value), 1);
    }
    else {
        filterCategory.push(this.value);
    }
    //если чекеты все сняты
    if (filterCategory.length == 0) {
        flowersList = startFlowerList;
    }
    //Тут нужно оставить массив только с нужными категориями
    else {
        flowersList = filterFlowersByCategory(filterCategory);
    }

    updateFlowersList(flowersDivCatalog, flowersList)
});
