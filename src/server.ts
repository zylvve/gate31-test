import http from 'http';
import axios from 'axios';

const PORT = 3000;
const MAX_RETRIES = 5; 
const RETRY_BASE_DELAY = 1000; 

const server = http.createServer((req, res) => {
    const urlPath = new URL(req.url!, `http://localhost`).pathname;
    console.log(`${req.method} ${req.url}`);

    const isValidRequest = (req.method === 'GET') && (
        urlPath === '/posts' ||
        urlPath.startsWith('/posts/') ||
        urlPath === '/users' ||
        urlPath.startsWith('/users/')
    );

    if (!isValidRequest) {
        res.writeHead(404);
        res.end(`Неподдерживаемый маршрут: ${req.method} ${req.url}`);
        return;
    }

    const url = `https://jsonplaceholder.typicode.com${req.url}`;

    const makeRequest = async (attempt: number) => {
        try {
            const apiRes = await axios(url, { method: req.method });
            res.writeHead(apiRes.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ proxy: true, data: apiRes.data }));
        } catch (err: unknown) {
            console.error(`${String(err)}`);
            if (axios.isAxiosError(err) && err.response && err.response.status >= 400 && err.response.status < 500) {
                res.writeHead(err.response.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ proxy: true, data: err.message }));
                return;
            }

            if (attempt < MAX_RETRIES) {
                console.log(`Повторная попытка ${attempt + 1}`);
                setTimeout(() => makeRequest(attempt + 1), RETRY_BASE_DELAY * (attempt ** 2));
            } else {
                res.writeHead(500);
                res.end('Ошибка подключения к внешнему API');
            }
        }
    };

    makeRequest(1);
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});