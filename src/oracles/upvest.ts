import * as fetch from 'node-fetch';
import { GasPricesForSource, Source } from '../types';
import { Oracle } from './oracle';

export class UpVestOracle extends Oracle {
    public source = Source.UpVest;

    constructor(public url: string = 'https://fees.upvest.co/estimate_eth_fees') {
        super();
    }

    public async _getGasPricesAsync(): Promise<GasPricesForSource | undefined> {
        const res = await fetch(this.url);
        if (!res.ok) {
            return undefined;
        }
        const gasInfo = await res.json();
        const [fast, average, safeLow] = ['fast', 'medium', 'slow'].map((k) => {
            const gasPriceWei = Number(gasInfo.estimates[k]);
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
