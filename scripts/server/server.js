const http = require('node:http');
const { connectDB, closeDB } = require('./database');

const host = '127.0.0.1';
const port = Number(process.env.PORT || 3001);

// Получаем только данные цветов. Таблицы клиентов и корзин не затрагиваем.
async function getFlowers() {
    const pool = await connectDB();
    const result = await pool.request().query(`
        SELECT Id, Name, ImagePath, Description, Care, Price
        FROM dbo.Flowers
        ORDER BY Id
    `);

    return result.recordset;
}

function sendJson(response, status, data) {
    response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(data));
}

const server = http.createServer(async (request, response) => {
    // Позволяет получать список с отдельной страницы, например через Live Server.
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const pathname = new URL(request.url, `http://${host}`).pathname;

    if (pathname !== '/api/flowers') {
        sendJson(response, 404, { error: 'Адрес не найден. Список цветов: /api/flowers' });
        return;
    }

    if (request.method === 'OPTIONS') {
        response.writeHead(204);
        response.end();
        return;
    }

    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET, OPTIONS');
        sendJson(response, 405, { error: 'Для получения цветов используйте GET.' });
        return;
    }

    try {
        const flowers = await getFlowers();
        sendJson(response, 200, flowers);
    } catch (error) {
        console.error('Не удалось получить цветы:', error.message);
        sendJson(response, 500, { error: 'Не удалось получить список цветов из базы данных.' });
    }
});

async function startServer(listenPort = port) {
    await connectDB();

    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(listenPort, host, () => {
            server.removeListener('error', reject);
            resolve();
        });
    });

    console.log(`Список цветов: http://${host}:${server.address().port}/api/flowers`);
    return server;
}

async function stopServer() {
    if (server.listening) {
        await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
            server.closeIdleConnections();
        });
    }

    await closeDB();
}

module.exports = { startServer, stopServer };

// Запуск: node scripts/server/server.js. Остановка: Ctrl+C.
if (require.main === module) {
    startServer().catch(async (error) => {
        console.error('Не удалось запустить сервер:', error.message);
        await closeDB();
        process.exitCode = 1;
    });

    for (const signal of ['SIGINT', 'SIGTERM']) {
        process.once(signal, () => {
            stopServer().catch((error) => {
                console.error('Ошибка остановки сервера:', error.message);
                process.exitCode = 1;
            });
        });
    }
}
