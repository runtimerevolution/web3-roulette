FROM mongo:latest
WORKDIR /app

ENV NODE_VERSION=18.16.0
ENV NVM_DIR=/root/.nvm

RUN mkdir ${NVM_DIR}
RUN apt-get update && apt-get install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}

ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

RUN apt-get update && apt-get install -y python3 python3-pip
RUN npm install --global yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .

EXPOSE 3000
CMD mongod --fork --logpath /var/log/mongodb.log && npx nx run node-app:serve --configuration=production