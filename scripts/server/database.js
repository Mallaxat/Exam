//Он будет отквечать за подключение к бд


const mssql = require("mssql");

const connection = mssql.connect({
    host: "localhost",
    database: "FlowerShopDB"

});
//Устанавливаем подключение
connection.connect(function (err) {
    if (err) {
        console.log("Ошибка подключения к базе данных");
        return;
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});
connection.end(function (err) {
    if (err) {
        return console.log("Ошибка: " + err.message);
    }
    console.log("Подключение закрыто");

});