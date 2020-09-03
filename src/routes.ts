import * as express from 'express';
import * as asyncHandler from 'express-async-handler';
import { Handler } from './handler';

export function createRouter(): express.Router {
    const router = express.Router();
    const handler = new Handler();
    router.get('/', asyncHandler(handler.getGasPricesAsync.bind(handler)));
    return router;
}
