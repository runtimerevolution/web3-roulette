# Front-end Application

1. Run `yarn install` to install the project dependencies

2. Setup the environment variables
```
cd ./packages/react-app && cp .env.example .env
```

3. To enable Google authentication, you need to fill the following environment variables in your `.env` file:
   - `VITE_GOOGLE_OAUTH_CLIENT_ID`: your Google OAuth Client ID
   - `VITE_GOOGLE_OAUTH_CLIENT_SECRET`: your Google OAuth Client Secret
   - `VITE_GOOGLE_OAUTH_REDIRECT`: your Google OAuth Redirect URI

4. Update the `VITE_FRONTEND_URI` value. Replace `localhost` with the domain hosting the React application

5. Setup and run the API, or update the `VITE_API_URI` variable to a publicly accessible address. Refer to the [documentation](./node-app.md) for instructions on local setup

7. Run `yarn start-react-app` to start the APP

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
