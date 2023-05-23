# Front-end Application

1. Install the needed dependencies \
   `yarn install`

2. Setup the environment variables \
   `cd ./packages/react-app` \
   `cp .env.example .env`

3. Fill `VITE_OAUTH_CLIENT_ID` value. Request to someone from the team. This value is a reference to cliend ID used for google authentication.

4. Start the app \
   `yarn start-react-app`

## Docker Setup

1. Build docker image \
   `docker build -t web3-roulette .`

2. Run a command in a new container \
   `docker run -p 8080:8080 -d web3-roulette`

Helpful commands:

- Stop the container: `docker stop <container-id>`
- Start existing container: `docker start <container-id>`
- List running containers: `docker ps`
