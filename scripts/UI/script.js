//Достаем цветы из json файла
//Тут уже массив объектов, с ними уже можно работать
import flowersList from '../../data/flowers.json' with { type: 'json' };

var flowersdiv = document.getElementById("flowersdiv");

console.dir(flowersList);

//Функция, для заполнения массива цветов из json файла
function fillFlowersList() {
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
        textHTML += "<span>Авторский букет</span></div>";
        textHTML += `<h3><p>${flowersList[i].Name}</p></h3>`;
        textHTML += `<p>${flowersList[i].Description}</p>`;
        textHTML += "<div class='productBottom'>";
        textHTML += "<div>";
        textHTML += `<strong>${flowersList[i].Price} ₽</strong>`;
        textHTML += "<span>Доставка от 60 минут</span></div>"
        textHTML += "<button type='button' aria-label='Добавить в корзину'>+</button>";
        textHTML += "</div></div></article>";

        flowersdiv.innerHTML += textHTML;
        textHTML = "";
    }

}

fillFlowersList();