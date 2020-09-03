import * as fetch from 'node-fetch';
import { GasPricesForSource, Source } from '../types';
import { Oracle } from './oracle';

export class MyCryptoOracle extends Oracle {
    public source = Source.MyCrypto;

    constructor(public url: string = 'https://gas.mycryptoapi.com/') {
        super();
    }

    public async _getGasPricesAsync(): Promise<GasPricesForSource | undefined> {
        const res = await fetch(this.url);
        if (!res.ok) {
            return undefined;
        }
        const gasInfo = await res.json();
        const [fast, average, safeLow] = ['fast', 'standard', 'safeLow'].map((k) => {
            const gasPriceWei = Number(gasInfo[k]);
            // tslint:disable-next-line:custom-no-magic-numbers
            return Math.floor(gasPriceWei * 1e9);
        });

        return {
            source: this.source,
            fast,
            average,
            standard: safeLow,
        };
    }
}
