// Получает список цветов с сервера и выводит его в консоль браузера.
async function getFlowers() {
    // response это объект ответа сервера, а не сам список цвето
    const response = await fetch('http://127.0.0.1:3001/api/flowers');

    if (!response.ok) {
        throw new Error(`Не удалось получить цветы. Код ответа: ${response.status}`);
    }
    //считывает тело джсона и получаем массив объектов
    const listFlowers = await response.json();
    console.log(listFlowers);
    return listFlowers;
}

getFlowers().catch(console.error);
