import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import { EtherchainOracle } from './oracles/etherchain';
import { EtherscanOracle } from './oracles/etherscan';
import { EthGasStationOracle } from './oracles/eth_gas_station';
import { GasNowOracle } from './oracles/gasnow';
import { MyCryptoOracle } from './oracles/mycrypto';
import { UpVestOracle } from './oracles/upvest';
import { GasPrices, GasPricesForSource, Source } from './types';

const ORACLES = [
    new EthGasStationOracle(process.env.ETH_GAS_STATION_URL),
    new EtherscanOracle(process.env.ETHERSCAN_URL),
    new EtherchainOracle(process.env.ETHERCHAIN_URL),
    new GasNowOracle(process.env.GAS_NOW_URL),
    new MyCryptoOracle(process.env.MY_CRYPTO_URL),
    new UpVestOracle(process.env.UP_VEST_URL),
];

ORACLES.filter((o) => o).map((o) => o.start());

const calcMedian = (oracleResults: GasPricesForSource[], k: keyof GasPrices) => {
    const results: number[] = oracleResults.map<number>((r) => r[k]);
    const sorted = results.sort((a, b) => a - b);
    return results[Math.ceil(sorted.length / 2)];
};

const calcAvg = (oracleResults: GasPricesForSource[], k: keyof GasPrices) => {
    const results: number[] = oracleResults.map<number>((r) => r[k]);
    const total = results.reduce((acc, c) => acc + c, 0);
    // clip it so its not super precise
    return Math.ceil(total / results.length / 1e4) * 1e4;
};

export class Handler {
    public async getGasPricesAsync(_req: express.Request, res: express.Response): Promise<void> {
        const oracleResults = (
            await Promise.all(ORACLES.map(async (oracle) => await oracle.getGasPricesAsync()))
        ).filter((o) => o);
        const median: GasPricesForSource = (() => {
            return {
                source: Source.Median,
                fast: calcMedian(oracleResults, 'fast'),
                average: calcMedian(oracleResults, 'average'),
                standard: calcMedian(oracleResults, 'standard'),
            };
        })();
        const average: GasPricesForSource = (() => {
            return {
                source: Source.Average,
                fast: calcAvg(oracleResults, 'fast'),
                average: calcAvg(oracleResults, 'average'),
                standard: calcAvg(oracleResults, 'standard'),
            };
        })();
        res.status(HttpStatus.OK).send({ result: [...oracleResults, median, average] });
    }
}
