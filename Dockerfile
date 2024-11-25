FROM node:20-alpine AS base
LABEL authors="Muhammad A. Fadillah"

WORKDIR /usr/src/app

RUN apk add --no-cache mysql-client

COPY package*.json ./

RUN npm install --only=production

# Install Google Cloud Storage dependencies
RUN npm install @google-cloud/storage

FROM base AS build

RUN npm install

COPY prisma ./prisma
COPY src ./src
COPY .env .env

COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npx prisma migrate deploy
RUN npx prisma generate

RUN npm run build

FROM base AS final

# Copy kunci layanan (service account) ke dalam container
COPY ./config/my-service-account.json /usr/src/app/config/my-service-account.json

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/.env .env

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
