# Node.js API

The Giveaways API is a RESTful API built with Node.js and MongoDB that allows users to create and manage giveaways.

## Setup

### Environment variables

First let's setup our development environment by running `yarn setup-node-app`. This command will create a `.env` file inside the `node-app` folder with the following variables:

- `SERVER_HOST`: The host for the server. Locally you can set it to `localhost`.
- `SERVER_PORT`: The port that the server will listen on. Locally you can set it to `3000`.
- `WEB3_PROVIDER`: The URL for the Web3 provider that will be used to interact with the blockchain. Locally you can set it to `http://127.0.0.1:7545`, the address of your Ganache instance.
- `DATABASE_URI`: The URI for the MongoDB database that the application will use. Locally you can set it to `mongodb://127.0.0.1:27017/web3-roulette`.
- `TEST_DATABASE_URI`: The URI for the MongoDB database that the application will use for testing. Locally you can set it to `mongodb://127.0.0.1:27017/test-web3-roulette`. Make sure that the URI is different from the main one because this database will be dropped after completing the tests.
- `APP_ORIGIN`: The URL for the frontend application.
- `GIVEAWAYS_CONTRACT_ADDRESS`: The address of the Giveaways contract on the blockchain. This value is required for the application to function and you can get it from the terminal once you deploy the contract to your Ganache instance (for more instructions on how to do that refer to the [Smart Contract Documentation](./truffle-app.md)).
- `OWNER_ACCOUNT_ADDRESS`: The address of the contract owner account on the blockchain. This value is required for the application to function and will be the first address in your Ganache instance (for more instructions on how to do that refer to the [Smart Contract Documentation](./truffle-app.md)).
- `ENCRYPTION_KEY`: A 256 bits string (32 characters) used to encrypt any user related data before sending it to the blockchain.
- `PRIVATE_KEY`: The private key of the account with owner access to the smart contract, used to send transactions to the blockchain without need for manual approval.
- `TA_ORIGIN`: The URL for the Team Allocator API.
- `TA_USER`: User to access the Team Allocator API.
- `TA_SECRET`: Secret to access the Team Allocator API.

### Install MongoDB locally

To create a MongoDB database instance locally we are going to use the MongoDB Community Edition. You can install it locally by running `yarn setup-db`.

Now, to start or stop the database instance you can run `yarn start-db` or `yarn stop-db`.

To manage the MongoDB locally, we recommend using [MongoDB Compass](https://www.mongodb.com/products/compass), which is a GUI tool that allows you to manage your MongoDB databases. Connect to your local MongoDB instance by specifying the connection details (e.g., `mongodb://127.0.0.1:27017`).

### Run the API

Now, to run the API, all you need is `yarn start-node-app`.

### Docker Setup

1. Build docker image \
   `docker build -f ./packages/node-app/node.Dockerfile -t luckydart-api .`

2. Run a container \
   `docker run --env-file ./packages/node-app/.env -p 3000:3000 luckydart-api`

Helpful commands:

- Stop the container: `docker stop <container-id>`
- Start existing container: `docker start <container-id>`
- List running containers: `docker ps`

## Deploy the app

1. Make sure you have the flyctl: a command line tool to work with Fly.io
   https://fly.io/docs/hands-on/install-flyctl/

2. Deploy the app \
   `fly deploy --config fly.node.toml --dockerfile packages/node-app/node.Dockerfile .`

Helpful commands:

- Add a secret \
  `fly --config fly.node.toml secrets set key=value`

- Check secrets and env variables \
  `fly --config fly.node.toml secrets list`
  `fly --config fly.node.toml config env`

- Check app status and vms \
  `fly --config fly.node.toml status`

- Check app services \
  `fly services list -a luckydart-api`

Monitor the app:
https://fly.io/apps/luckydart-api/monitoring
