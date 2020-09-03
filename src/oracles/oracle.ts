import { clearInterval, setTimeout } from 'timers';
import { logger } from '../logger';
import { GasPricesForSource, Source } from '../types';

export abstract class Oracle {
    private interval: ReturnType<typeof setTimeout>;
    public abstract source: Source;
    public prev: GasPricesForSource | undefined;

    public start() {
        const execute = async () => {
            logger.debug(`${this.source} polling`);
            try {
                this.prev = await this._getGasPricesAsync();
            } catch (e) {
                logger.error(`${this.source} ${e.message} ${e.stack}`);
            }
        };
        void execute();
        this.interval = setInterval(execute, 15000);
        this.interval.unref && this.interval.unref();
    }

    public stop() {
        clearInterval(this.interval);
    }

    public abstract _getGasPricesAsync(): Promise<GasPricesForSource | undefined>;

    public async getGasPricesAsync(): Promise<GasPricesForSource | undefined> {
        return this.prev;
    }
}
