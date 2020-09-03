export enum Source {
    EthGasStation = 'ETH_GAS_STATION',
    Etherscan = 'ETHERSCAN',
    Etherchain = 'ETHERCHAIN',
    GasNow = 'GAS_NOW',
    MyCrypto = 'MY_CRYPTO',
    UpVest = 'UP_VEST',
    Median = 'MEDIAN',
    Average = 'AVERAGE',
}

export interface GasPrices {
    fast: number;
    average: number;
    standard: number;
}

export interface GasPricesForSource extends GasPrices {
    source: Source;
}
