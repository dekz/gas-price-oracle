import * as fetch from 'node-fetch';
import { GasPricesForSource, Source } from '../types';
import { Oracle } from './oracle';

export class GasNowOracle extends Oracle {
    public source = Source.GasNow;

    constructor(public url: string = 'https://www.gasnow.org/api/v1/gas/price') {
        super();
    }

    public async _getGasPricesAsync(): Promise<GasPricesForSource | undefined> {
        const res = await fetch(this.url);
        if (!res.ok) {
            return undefined;
        }
        const gasInfo = await res.json();
        const [fast, average, safeLow] = ['top50', 'top200', 'top400'].map((k) => {
            const gasPriceWei = Number(gasInfo.data[k]);
            // tslint:disable-next-line:custom-no-magic-numbers
            return Math.floor(gasPriceWei);
        });

        return {
            source: this.source,
            fast,
            average,
            standard: safeLow,
        };
    }
}
