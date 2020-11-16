const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const _ = require("lodash");

const getVaultsApy = async () => {
  const params = {
    TableName: "vaultApy",
  };
  const entries = await db.scan(params).promise();
  const apy = entries.Items;

  const injectVaultAddress = (vault) => {
    vault.vaultAddress = vault.address;
    return vault;
  };
  const vaultAddress = _.map(apy, injectVaultAddress);
  return apy;
};

exports.getVaultsApy = getVaultsApy;

exports.handler = async (event) => {
  const apy = await getVaultsApy();
  const response = {
    statusCode: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(apy),
  };
  return response;
};
