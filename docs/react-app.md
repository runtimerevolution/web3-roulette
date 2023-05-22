# Front-end Application

1. Install the needed dependencies \
   `yarn install`

2. Setup the environment variables \
   `cd ./packages/react-app` \
   `cp .env.example .env`

3. Fill `VITE_OAUTH_CLIENT_ID` value. Request to someone from the team. This value is a reference to cliend ID used for google authentication.

4. Update `VITE_FRONTEND_URI` value. Replace `localhost` with the IP address / domain hosting the react application. This will make sure that features such as QR code will work, when scaning through the mobile device.

5. Do the [backend api setup](./node-app.md).

6. Start the backend api \
   `yarn start-node-app`

7. Start the app \
   `yarn start-react-app`
