FROM node-alpine3.17

WORKDIR /app

RUN npm install yarn

COPY package*.json .

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE 3800

CMD ["yarn", "prod"]