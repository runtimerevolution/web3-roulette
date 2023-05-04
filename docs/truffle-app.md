# Smart Contract

The Giveaways smart contract is a Solidity contract that allows for the creation of giveaways in the Ethereum blockchain, where a winner or winners can be randomly selected from a list of eligible participants. It provides functionality to create a giveaway, add participants and generate winners, as well cas some getter function to facilitate testing.

## Setup
### Install Ganache

Ganache is a local development blockchain used to develop decentralized applications (DApps) on the Ethereum blockchain. It simulates the Ethereum network, and lets you check how the app will perform before releasing it to production.

Once you install it, open it and click on _Quickstart Ethereum_. It should look something like this:

![Ganache](./assets/ganache.png)

As you can see, it provides you with some test accounts that already have Ether in them so you can deploy and test the smart contract. If you ever run out of Ether just restart Ganache.

### Install Truffle

Truffle is a development environment, testing framework and asset pipeline for Ethereum, aiming to make life as an Ethereum developer easier. To install it in your development environment just run the following command:

```
npm install -g truffle
```

From there, you can run `truffle compile`, `truffle migrate` and `truffle test` to compile your contracts, deploy those contracts to the network, and run their associated unit tests.
