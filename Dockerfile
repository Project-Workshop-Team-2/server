ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine

WORKDIR /app/server

RUN npm i -g pnpm

COPY --link package.json .

RUN pnpm install

COPY --link . .

RUN pnpm build

EXPOSE 8080

CMD ["node", "--run", "start"]
