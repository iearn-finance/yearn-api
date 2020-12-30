'use strict';

const handler = require('../../../lib/handler');
const dynamodb = require('../../../utils/dynamoDb');
const _ = require('lodash');

const db = dynamodb.doc;

module.exports.handler = handler(async () => {
  const params = {
    TableName: 'vaultApy',
  };
  const entries = await db.scan(params).promise();
  const vaults = entries.Items;

  const symbol = 'yCRV';
  const assets = ['TUSD', 'DAI', 'USDT', 'USDC'];

  const vault = _.find(vaults, { symbol });
  const { apyLoanscan = 0 } = vault;

  const getLoanscanFormat = (tokenSymbol) => {
    const apy = apyLoanscan / 100;
    const apr = apy;
    const loanScanData = { apy, apr, tokenSymbol };
    return loanScanData;
  };

  const loanScanResponse = { lendRates: _.map(assets, getLoanscanFormat) };

  return loanScanResponse;
});
