const { connectDB } = require('./database');

// Вызывает dbo.GetAllFlowers, возвращает список цветов JSON-строкой и закрывает соединение.
async function getFlowers() {
    const pool = await connectDB();

    try {
        const result = await pool.request().execute('dbo.GetAllFlowers');
        return JSON.stringify(result.recordset);
    } finally {
        await pool.close();
    }
}

module.exports = { getFlowers };
