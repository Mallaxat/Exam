//Достаем цветы из json файла
//Тут уже массив объектов, с ними уже можно работать
import flowersList from '../../data/flowers.json' with { type: 'json' };
import flowersType from '../../data/flowersType.json' with { type: 'json' };

function GetFlowers()
{
    return flowersList;
}
function GetFlowersType()
{
    return flowersType;
}

//Функция, для заполнения массива цветов из json файла
function fillFlowersList(flowers) {
    let textHTML = "";
    for (let i = 0; i < flowersList.length; i++) {

        textHTML += "<article class='productCard'>";
        textHTML += "<div class='productImage'>";
        textHTML += `<img src="${flowersList[i].ImagePath}" width="640" height="680" loading="lazy">`
        textHTML += "<span class='productBadge'>Выбор флориста</span>";
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
        textHTML += `<button type='button' class='addOrder' data-id=${flowersList[i].Id}>+</button>`;
        textHTML += "</div></div></article>";

        flowers.innerHTML += textHTML;
        textHTML = "";
    }
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
        textHTML += `<button type='button' class='addOrder' data-id=${flowersList[i].Id}>+</button>`;
        textHTML += "</div></div></article>";

        element.innerHTML += textHTML;
        textHTML = "";
    }
    return flowersList;
}

function FillFlowersType(element) {
    let textHTML = "<legend>Цветы</legend>";

    //из массива берем ключ и значение
    for (let [key, value] of Object.entries(flowersType[0])) {
        textHTML += `<label><input type="checkbox" name="flower" value="${key}">${value}</label>`;
    }
    element.innerHTML = textHTML;
}

function FillFlowersAdd(element, array) {
    let textHTML = "";
    let flowers = [];

    // Убираем повторения 
    for (let i = 0; i < array.length; i++) {
        let flower = flowers.find(fl => fl.Id == array[i].Id);

        if (flower) flower.quantity++;
        else flowers.push({ ...array[i], quantity: 1 });
       
    }
    for (let i = 0; i < flowers.length; i++) {
        textHTML += `
            <article class="cartItem" data-id="${flowers[i].Id}">
                 <img src="${flowers[i].ImagePath}" width="120" height="140">
            <div>

                    <h2>${flowers[i].Name}</h2>
                    <p>${flowers[i].Type == 0 ? "Авторский букет" : "Монобукет"}</p>
                    <div class="quantityControl">
                        <button type="button" data-id="minus">−</button>
                        <span>${flowers[i].quantity}</span>
                        <button type="button" data-id="plus">+</button>
                    </div>
                </div>
                <div>
                    <strong>${flowers[i].Price} ₽</strong>
                    <button class="resetButton" type="button" onclick="Delete()">Удалить</button>
                </div>
            </article>`;
    }
    element.innerHTML = textHTML;
}

export {fillFlowersList, GetFlowers,updateFlowersList,GetFlowersType,FillFlowersType,FillFlowersAdd};
