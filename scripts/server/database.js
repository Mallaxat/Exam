
//будет отвечать за подключение
const sql = require("mssql/msnodesqlv8");

const serverName = "DESKTOP-SAUNGMH";

const config = {
    server: serverName,
    database: "FlowerShopDB",
    connectionString:
        `Driver={ODBC Driver 18 for SQL Server};` +
        `Server=${serverName};` +
        `Database=FlowerShopDB;` +
        `Trusted_Connection=Yes;` +
        `Encrypt=Yes;` +
        `TrustServerCertificate=Yes;`
};

// Подключение к базе
async function connectDB() {
    try {
        const pool = await sql.connect(config);

        console.log("Подключение к FlowerShopDB успешно!");
        return pool;

    } catch (error) {
        console.error("Ошибка подключения:", error.message);
        throw error;
    }
}


