FROM node:18.16.0

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN npx nx build node-app

EXPOSE 3000
CMD node ./dist/packages/node-app/src/main.js