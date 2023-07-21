require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { PRIVATE_KEY } = process.env;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*', // Match any network id
    },
    matic: {
      provider: () =>
        new HDWalletProvider([PRIVATE_KEY], `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: '0.8.0',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
