import * as fetch from 'node-fetch';
import { GasPricesForSource, Source } from '../types';
import { Oracle } from './oracle';

const BASE_TEN = 10;

export class EthGasStationOracle extends Oracle {
    public source = Source.EthGasStation;

    constructor(public url: string = 'https://ethgasstation.info/json/ethgasAPI.json') {
        super();
    }

    public async _getGasPricesAsync(): Promise<GasPricesForSource | undefined> {
        const res = await fetch(this.url);
        if (!res.ok) {
            return undefined;
        }
        const gasInfo = await res.json();
        const [fast, average, safeLow] = ['fast', 'average', 'safeLow'].map((k) => {
            const gasPriceGwei = Number(gasInfo[k]) / BASE_TEN;
            // tslint:disable-next-line:custom-no-magic-numbers
            return Math.floor((gasPriceGwei / 10) * 10e9);
        });

        return {
            source: this.source,
            fast,
            average,
            standard: safeLow,
        };
    }
}
