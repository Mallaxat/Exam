//Установка пакетов
//const http = require("http");   // для обработки входящих запросов
//const fs = require("fs");       // для чтения с жесткого диска файла index.html

//Создание сервера
//Как параметр функция-обработчик, которая будет вызываться 
              // каждый раз, когда к серверу прихоит запрос
//в ней должно быть 2 параметра :
//request - содержит данные запроса
//response - управляет отправкой ответа

class Client{
    Name;
    Phone;
    City;
    Street;
    House;
    Apartment;
    Items = [];
}

const http = require("http");
const fs=require("fs");
const { randomUUID } = require("node:crypto");
const ordersPath = `${__dirname}/ReadyOrder.json`;
let saveQueue = Promise.resolve();

// Добавляет заказ в историю, сохраняя ранее записанные заказы.
async function appendOrder(client) {
    let contents = "";
    try {
        contents = await fs.promises.readFile(ordersPath, "utf8");
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }

    const saved = contents.trim() ? JSON.parse(contents.trim()) : [];
    if (!saved || typeof saved !== "object") {
        throw new Error("Неверный формат файла заказов");
    }

    const orders = Array.isArray(saved) ? saved : [saved];
    orders.push(client);

    // Заменяем файл только после успешной записи полного списка.
    const tempPath = `${ordersPath}.${randomUUID()}.tmp`;
    try {
        await fs.promises.writeFile(tempPath, JSON.stringify(orders, null, 2) + "\n", "utf8");
        await fs.promises.rename(tempPath, ordersPath);
    } catch (error) {
        await fs.promises.unlink(tempPath).catch(() => {});
        throw error;
    }
}

http.createServer(async function (request, response) {

    // Разрешаем странице с локального Live Server прочитать ответ.
    const origin = request.headers.origin;
    if (origin && /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin)) {
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Vary", "Origin");
    }

    console.log("Получен запрос:", request.url);

    if (request.method === "POST" && request.url === "/order") {
        const client = new Client();
        
        console.log("Запрос найден!");
        let body="";
        //ждем результата и в константу из полученных данных берем в буфер значения
        for await (const chunk of request)
        {
            body+=chunk;
        }
        const exp = /Content-Disposition: form-data; name="([^"]+)"\r\n\r\n([^\r\n]*)/g;

        let formElement;
    //заполняем объект
        while ((formElement = exp.exec(body)) !== null) {
            let paramName = formElement[1];
            let paramValue = formElement[2];

            switch (paramName) {
                case "clientName":
                    client.Name = paramValue;
                    break;
                case "phone":
                    client.Phone = paramValue;
                    break;
                case "city":
                    client.City = paramValue;
                    break;
                case "street":
                    client.Street = paramValue;
                    break;
                case "house":
                    client.House = paramValue;
                    break;
                case "apartment":
                    client.Apartment = Number(paramValue);
                    break;
                case "items":
                    try {
                        client.Items = JSON.parse(paramValue);
                    } catch {
                        response.statusCode = 400;
                        response.end("Неверный формат товаров");
                        return;
                    }
                    break;
                    
            }
        }
        try {
            // Записываем заказы по очереди, чтобы одновременные запросы не потеряли записи.
            const pendingSave = saveQueue.then(() => appendOrder(client));
            saveQueue = pendingSave.catch(() => {});
            await pendingSave;
        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.end("Не удалось сохранить");
            return;
        }

        console.log("Файл успешно записан");
        response.statusCode = 200;
        response.end("OK");
        return;
    }
    console.log("Запрос не найден!");
    response.statusCode = 404;
    response.end("Адрес не найден");

}).listen(3000, () => { console.log("Сервер запущен на порту 3000"); });
