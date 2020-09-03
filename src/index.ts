import { getAppAsync } from "./app";

process.on('uncaughtException', err => {
    console.log(err);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    if (err) {
        console.log(err);
    }
});

if (require.main === module) {
    (async () => {
        // const provider = providerUtils.createWeb3Provider(defaultHttpServiceWithRateLimiterConfig.ethereumRpcUrl);
        // const dependencies = await getDefaultAppDependenciesAsync(provider, defaultHttpServiceWithRateLimiterConfig);
        await getAppAsync();
    })().catch(error => console.error(error.stack));
}
