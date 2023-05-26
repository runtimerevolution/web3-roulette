require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { INFURA_API_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*', // Match any network id
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          [PRIVATE_KEY],
          `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
        ),
      network_id: 11155111,
      gas: 5000000,
      confirmations: 1,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    mainnet: {
      provider: () =>
        new HDWalletProvider(
          [PRIVATE_KEY],
          `https://mainnet.infura.io/v3/${INFURA_API_KEY}`
        ),
      network_id: 1,
      gas: 5000000,
      confirmations: 1,
      timeoutBlocks: 200,
      skipDryRun: true,
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
