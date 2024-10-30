FROM node:lts AS build-env

WORKDIR /investment-income-tax

COPY . .

RUN yarn install --frozen-lockfile && yarn build

FROM node:lts-alpine

WORKDIR /investment-income-tax

COPY --from=build-env /investment-income-tax/dist/investment-income-tax ./

RUN yarn install --frozen-lockfile --production

CMD ["node", "/investment-income-tax/main.js"]
