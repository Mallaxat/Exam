const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString:
        'Driver={ODBC Driver 18 for SQL Server};' +
        'Server=DESKTOP-SAUNGMH;' +
        'Database=FlowerShopDB;' +
        'Trusted_Connection=Yes;' +
        'Encrypt=Yes;' +
        'TrustServerCertificate=Yes;',
    connectionTimeout: 15000,
    requestTimeout: 15000
};

// Открывает соединение с FlowerShopDB под текущей учётной записью Windows.
async function connectDB() {
    const pool = new sql.ConnectionPool(config);

    pool.on('error', (error) => {
        console.error('Ошибка соединения с базой:', error.message);
    });

    try {
        await pool.connect();
        return pool;
    } catch (error) {
        await pool.close().catch(() => {});
        throw error;
    }
}

module.exports = { connectDB };
