'use strict';

const Web3 = require('web3');

const web3 = new Web3(process.env.ARCHIVENODE_ENDPOINT);

const ABI_MAP = {
  v1: require('../../../../abi/vaultV1.json'),
  v2: require('../../../../abi/vaultV2.json'),
};

const PPFS_MAP = {
  v1: 'getPricePerFullShare',
  v2: 'pricePerShare',
};

module.exports.fetchBlockStats = async () => {
  const blocksPerMinute = 4;
  const blocksPerHour = 60 * blocksPerMinute;
  const blocksPerDay = blocksPerHour * 24;
  const blocksPerMonth = blocksPerDay * 30;
  const currentBlock = await web3.eth.getBlockNumber();
  const oneMonthAgoBlock = currentBlock - blocksPerMonth;
  return {
    blocksPerDay,
    currentBlock,
    oneMonthAgoBlock,
  };
};

const calculateYearlyRoi = (
  previousValue,
  currentValue,
  previousBlock,
  currentBlock,
  blocksPerDay,
) => {
  const pricePerFullShareDelta = (currentValue - previousValue) / 1e18;
  const blockDelta = currentBlock - previousBlock;
  const dailyRoi = (pricePerFullShareDelta / blockDelta) * 100 * blocksPerDay;
  const yearlyRoi = dailyRoi * 365;
  return yearlyRoi;
};

module.exports.getVaultApy = async (vault, blockStats) => {
  const { currentBlock, oneMonthAgoBlock, blocksPerDay } = blockStats;
  const { inceptionBlock, address } = vault;

  const vaultContract = new web3.eth.Contract(ABI_MAP[vault.type], address);
  const pricePerShare = vaultContract.methods[PPFS_MAP[vault.type]];

  const getPrice = async (block, fallback) => {
    if (block) {
      return block > inceptionBlock
        ? await pricePerShare().call(undefined, block)
        : fallback;
    }
    return await pricePerShare().call();
  };

  const currentPricePerFullShare = await getPrice();

  const inceptionPricePerFullShare = 1e18;
  const inception = calculateYearlyRoi(
    inceptionPricePerFullShare,
    currentPricePerFullShare,
    inceptionBlock,
    currentBlock,
    blocksPerDay,
  );

  const oneMonthAgoPricePerFullShare = await getPrice(
    oneMonthAgoBlock,
    inceptionPricePerFullShare,
  );

  const oneMonth = calculateYearlyRoi(
    oneMonthAgoPricePerFullShare,
    currentPricePerFullShare,
    oneMonthAgoBlock,
    currentBlock,
    blocksPerDay,
  );

  return {
    oneMonth,
    inception,
  };
};
