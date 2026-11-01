// Подключение к SQL Server под текущей учётной записью Windows.
const sql = require('mssql/msnodesqlv8');

const serverName = 'DESKTOP-SAUNGMH';

const config = {
    server: serverName,
    database: 'FlowerShopDB',
    connectionString:
        'Driver={ODBC Driver 18 for SQL Server};' +
        `Server=${serverName};` +
        'Database=FlowerShopDB;' +
        'Trusted_Connection=Yes;' +
        'Encrypt=Yes;' +
        'TrustServerCertificate=Yes;',
    connectionTimeout: 15000,
    requestTimeout: 15000,
    pool: {
        min: 0,
        max: 5,
        idleTimeoutMillis: 30000
    }
};

const pool = new sql.ConnectionPool(config);
let connectionPromise = null;

pool.on('error', (error) => {
    console.error('Ошибка соединения с базой:', error.message);
});

// Все запросы используют один пул соединений.
async function connectDB() {
    if (!connectionPromise) {
        connectionPromise = (async () => {
            try {
                await pool.connect();
                await pool.request().query('SELECT 1 AS connectionCheck');
                console.log('Подключение к FlowerShopDB успешно!');
                return pool;
            } catch (error) {
                await pool.close().catch(() => {});
                throw error;
            }
        })();
    }

    try {
        return await connectionPromise;
    } catch (error) {
        connectionPromise = null;
        throw error;
    }
}

async function closeDB() {
    await pool.close();
    connectionPromise = null;
}

module.exports = { connectDB, closeDB };

// Отдельная проверка: node scripts/server/database.js
if (require.main === module) {
    (async () => {
        try {
            await connectDB();
        } catch (error) {
            console.error('Ошибка подключения:', error.message);
            process.exitCode = 1;
        } finally {
            await closeDB();
        }
    })();
}
