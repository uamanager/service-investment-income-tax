FROM node:lts AS build-env

WORKDIR /investment-income-tax

COPY . .

RUN yarn install --frozen-lockfile && yarn build:all:prod

FROM node:lts-alpine

WORKDIR /investment-income-tax

COPY --from=build-env /dist/apps/server ./

RUN yarn install --frozen-lockfile --production

CMD ["node", "/investment-income-tax/main.js"]
