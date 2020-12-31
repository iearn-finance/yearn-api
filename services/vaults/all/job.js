'use strict';

require('dotenv').config();
const Web3BatchCall = require('web3-batch-call');
const delay = require('delay');

const unix = require('../../../lib/timestamp');
const handler = require('../../../lib/handler');
const erc20Abi = require('../../../abi/erc20.json');

const vaultInterface = require('../lib/vaults');

// FetchTokenDetails with a batch call to the ERC20 token addresses inside
// each vault. Extracting name, symbol and decimals.
const fetchTokenDetails = async (client, vaults) => {
  const readMethods = [
    { name: 'name' },
    { name: 'symbol' },
    { name: 'decimals' },
  ];

  const contracts = [
    {
      addresses: vaults.map(({ token }) => token.address),
      abi: erc20Abi,
      readMethods,
    },
  ];

  const res = await client.execute(contracts);
  return Object.fromEntries(res.map((token) => [token.address, token]));
};

// FetchAllVaults with a batch call to all the available addresses for each
// version. Extracting name, symbol, decimails and the token address.
const fetchAllVaults = async (client) => {
  let v1Addresses = await vaultInterface.v1.fetchAddresses();
  let v2Addresses = await vaultInterface.v2.fetchAddresses();

  const all = [...v1Addresses, ...v2Addresses];
  const cachedVaultsMap = await vaultInterface.cache.fetchCachedVaults(all);

  v1Addresses = v1Addresses.filter((address) => !cachedVaultsMap[address]);
  v2Addresses = v2Addresses.filter((address) => !cachedVaultsMap[address]);

  const cachedVaults = Object.values(cachedVaultsMap);

  if ([...v1Addresses, ...v2Addresses].length === 0) {
    return cachedVaults;
  }

  const readMethods = [
    { name: 'name' },
    { name: 'symbol' },
    { name: 'decimals' },
    { name: 'token' },
  ];
  const contracts = [
    {
      namespace: 'v1',
      addresses: v1Addresses,
      abi: vaultInterface.v1.abi(),
      readMethods,
    },
    {
      namespace: 'v2',
      addresses: v2Addresses,
      abi: vaultInterface.v2.abi(),
      readMethods,
    },
  ];

  // Fetch new vaults data
  const res = await client.execute(contracts);
  const newVaults = res.map(
    ({ address, namespace: type, name, symbol, decimals, token }) => ({
      address,
      type,
      name,
      symbol,
      decimals,
      token: {
        address: token,
      },
    }),
  );

  // Inject inception block from etherscan
  for (const vault of newVaults) {
    const { address } = vault;
    const inceptionBlock = await vaultInterface.getInceptionBlock(address);
    await delay(300);
    vault.inceptionBlock = inceptionBlock;
  }

  // Inject token details
  const tokenDetails = await fetchTokenDetails(client, newVaults);

  for (const vault of newVaults) {
    vault.token = tokenDetails[vault.token.address];
  }

  const timestamp = unix();

  // Add timestamps
  for (const vault of newVaults) {
    vault.created = timestamp;
  }

  return [...newVaults, ...cachedVaults];
};

module.exports.handler = handler(async () => {
  const provider = process.env.WEB3_ENDPOINT;
  const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

  const client = new Web3BatchCall({
    provider,
    simplifyResponse: true,
    etherscan: {
      apiKey: etherscanApiKey,
      delay: 300,
    },
  });

  const vaults = await fetchAllVaults(client);

  // Update ROI and Assets

  // ROI
  const blockStats = await vaultInterface.roi.fetchBlockStats();
  await Promise.all(
    vaults.map(async (vault) => {
      try {
        vault.apy = await vaultInterface.roi.getVaultApy(vault, blockStats);
      } catch {
        vault.apy = {};
      }
    }),
  );

  // Assets
  const assets = await vaultInterface.assets.fetchAssets();
  const symbolAliases = await vaultInterface.assets.fetchSymbolAliases();

  for (const vault of vaults) {
    vault.token.displayName =
      symbolAliases[vault.token.address] || vault.token.symbol;
    vault.displayName = vault.token.displayName;

    vault.token.icon = assets[vault.token.address] || null;
    vault.icon = assets[vault.address] || null;
  }

  const timestamp = unix();

  // Add timestamps
  for (const vault of vaults) {
    vault.updated = timestamp;
  }

  // Cache updated & new vaults
  await vaultInterface.cache.cacheVaults(vaults);

  return {
    message: 'Job executed correctly',
  };
});
