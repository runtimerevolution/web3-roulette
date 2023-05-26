import Web3 from 'web3';
import Contract from './Giveaways.json';
import { AbiItem } from 'web3-utils';

const { WEB3_PROVIDER, GIVEAWAYS_CONTRACT_ADDRESS, PRIVATE_KEY } = process.env;

const web3 = new Web3(WEB3_PROVIDER);
const contractAddress = GIVEAWAYS_CONTRACT_ADDRESS;
web3.eth.accounts.wallet.add(PRIVATE_KEY);
export const giveawaysContract = new web3.eth.Contract(
  Contract.abi as AbiItem[],
  contractAddress
);
