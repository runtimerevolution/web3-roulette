import Web3 from "web3";
import Contract from "./Giveaways.json";
import { AbiItem } from "web3-utils";

const web3 = new Web3(process.env.WEB3_PROVIDER);
const contractAddress = process.env.GIVEAWAYS_CONTRACT_ADDRESS;
export const giveawaysContract = new web3.eth.Contract(Contract.abi as AbiItem[], contractAddress);
