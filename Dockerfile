FROM node:18.16.0 as build 

WORKDIR /react-app
COPY package*.json .
RUN npm install
COPY . .
RUN npx nx build react-app

FROM nginx:1.19
COPY ./packages/react-app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /react-app/dist/packages/react-app /usr/share/nginx/html