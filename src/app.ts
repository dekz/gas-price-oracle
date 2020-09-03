import * as express from 'express';
import { createServer, Server } from 'http';
import { requestLogger } from './logger';
import { createRouter } from './routes';


export async function getAppAsync(
): Promise<{ app: Express.Application; server: Server }> {
    const app = express();

    app.use(requestLogger());
    app.use('/', createRouter());

    const server = createServer(app);
    server.listen(process.env.PORT || 3001);

    return { app, server };
}
