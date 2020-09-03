import * as fetch from 'node-fetch';
import { GasPricesForSource, Source } from '../types';
import { Oracle } from './oracle';

export class EtherscanOracle extends Oracle {
    public source = Source.Etherscan;

    constructor(public url: string = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle') {
        super();
    }

    public async _getGasPricesAsync(): Promise<GasPricesForSource | undefined> {
        const res = await fetch(this.url);
        if (!res.ok) {
            return undefined;
        }
        const gasInfo = await res.json();
        const [fast, average, safeLow] = ['FastGasPrice', 'ProposeGasPrice', 'SafeGasPrice'].map((k) => {
            const gasPriceGwei = Number(gasInfo.result[k]);
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
