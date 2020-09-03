import * as fetch from 'node-fetch';
import { GasPricesForSource, Source } from '../types';
import { Oracle } from './oracle';

export class EtherchainOracle extends Oracle {
    public source = Source.Etherchain;

    constructor(public url: string = 'https://www.etherchain.org/api/gasPriceOracle') {
        super();
    }

    public async _getGasPricesAsync(): Promise<GasPricesForSource | undefined> {
        const res = await fetch(this.url);
        if (!res.ok) {
            return undefined;
        }
        const gasInfo = await res.json();
        const [fast, average, safeLow] = ['fast', 'standard', 'safeLow'].map((k) => {
            const gasPriceGwei = Number(gasInfo[k]);
            // tslint:disable-next-line:custom-no-magic-numbers
            return Math.floor(gasPriceGwei * 1e9);
        });

        return {
            source: this.source,
            fast,
            average,
            standard: safeLow,
        };
    }
}
