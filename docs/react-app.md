# Front-end Application

1. Install the needed dependencies \
   `yarn install`

2. Setup the environment variables \
   `cd ./packages/react-app` \
   `cp .env.example .env`

3. Fill `VITE_OAUTH_CLIENT_ID` value. Request to someone from the team. This value is a reference to cliend ID used for google authentication.

4. Update `VITE_FRONTEND_URI` value. Replace `localhost` with the domain hosting the react application. This will make sure that features such as QR code will work, when scaning through the mobile device.

5. Do the [backend api setup](./node-app.md).

6. Start the backend api \
   `yarn start-node-app`

7. Start the app \
   `yarn start-react-app`

## Docker Setup

1. Build docker image \
   `docker build -f ./packages/react-app/react.Dockerfile -t luckydart .`

2. Run a container \
   `docker run -p 8080:8080 luckydart`

Helpful commands:

- Stop the container: `docker stop <container-id>`
- Start existing container: `docker start <container-id>`
- List running containers: `docker ps`

## Deploy the app

1. Make sure you have the flyctl: a command line tool to work with Fly.io
   https://fly.io/docs/hands-on/install-flyctl/

2. Deploy the app \
   `fly deploy --config fly.react.toml --dockerfile packages/react-app/react.Dockerfile .`

Helpful commands:

- Add a secret \
  `fly --config fly.react.toml secrets set key=value`

- Check secrets and env variables \
  `fly --config fly.react.toml secrets list`
  `fly --config fly.react.toml config env`

- Check app status and vms \
  `fly --config fly.react.toml status`

- Check app services \
  `fly services list -a luckydart`

Monitor the app:
https://fly.io/apps/luckydart/monitoring
