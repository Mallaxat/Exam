//Достаем цветы из json файла
//Тут уже массив объектов, с ними уже можно работать
import flowersList from '../../data/flowers.json' with { type: 'json' };


//Функция, для заполнения массива цветов из json файла
function fillFlowersList(flowers) {
    let textHTML = "";
    for (let i = 0; i < flowersList.length; i++) {

        textHTML += "<article class='productCard'>";
        textHTML += "<div class='productImage'>";
        textHTML += `<img src="${flowersList[i].ImagePath}" width="640" height="680" loading="lazy">`
        textHTML += "<span class='productBadge'>Выбор флориста</span>";
        textHTML += "<button class='favoriteButton' type='button' aria-label='Добавить в избранное'>♡</button>";
        textHTML += "</div>";
        textHTML += "<div class='productInfo'>";
        textHTML += "<div class='productMeta'>";
        textHTML += "</div>";
        textHTML += `<h3><p>${flowersList[i].Name}</p></h3>`;
        textHTML += `<p>${flowersList[i].Description}</p>`;
        textHTML += "<div class='productBottom'>";
        textHTML += "<div>";
        textHTML += `<strong>${flowersList[i].Price} ₽</strong>`;
        textHTML += "<span>Доставка от 60 минут</span></div>"
        textHTML += "<button type='button' aria-label='Добавить в корзину'>+</button>";
        textHTML += "</div></div></article>";

        flowers.innerHTML += textHTML;
        textHTML = "";
    }
    return flowersList;
}

//Функция, для обновления массива цветов из json файла
function updateFlowersList(element,array) {

    element.innerHTML="";
    let textHTML = "";
    for (let i = 0; i < array.length; i++) {

        textHTML += "<article class='productCard'>";
        textHTML += "<div class='productImage'>";
        textHTML += `<img src="${array[i].ImagePath}" width="640" height="680" loading="lazy">`
        textHTML += "<span class='productBadge'>Выбор флориста</span>";
        textHTML += "<button class='favoriteButton' type='button' aria-label='Добавить в избранное'>♡</button>";
        textHTML += "</div>";
        textHTML += "<div class='productInfo'>";
        textHTML += "<div class='productMeta'>";
        textHTML += "</div>";
        textHTML += `<h3><p>${array[i].Name}</p></h3>`;
        textHTML += `<p>${array[i].Description}</p>`;
        textHTML += "<div class='productBottom'>";
        textHTML += "<div>";
        textHTML += `<strong>${array[i].Price} ₽</strong>`;
        textHTML += "<span>Доставка от 60 минут</span></div>"
        textHTML += "<button type='button' aria-label='Добавить в корзину'>+</button>";
        textHTML += "</div></div></article>";

        element.innerHTML += textHTML;
        textHTML = "";
    }
    return flowersList;
}

//Функция, которая будет фильтровать цветы по категории и возвращать массив объектов
function filterFlowersByCategory(categories) 
{
    let array=[];
    for(let i=0; i<categories.length; i++)
    {
        //Берем список категорий, смотрим есть ли совпадение в этом цветке
        //если категория цветка содержит категорию списка - оставляем в массиве
        array=flowersList.filter(flower=>categories.some(category=>flower.Category.includes(category)));
    }
    return array;
}



export {fillFlowersList, filterFlowersByCategory,updateFlowersList};
