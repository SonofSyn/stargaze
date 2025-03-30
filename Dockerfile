FROM node:20-alpine as runtime

WORKDIR /var/app
RUN apk add python3 gcc g++ make
COPY ./docker/*.json ./


RUN npm install --omit=dev

FROM node:20-alpine

WORKDIR /var/app
COPY --from=runtime /var/app/node_modules ./node_modules

ENTRYPOINT ["node","--input-type", "module", "-e", "import { StartServer } from 'stargaze'; StartServer(process.env.SERVERPORT||3002);"]
