FROM node:18.16.0 as build
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN npx nx build react-app

FROM nginx:1.19
COPY ./packages/react-app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/packages/react-app /usr/share/nginx/html