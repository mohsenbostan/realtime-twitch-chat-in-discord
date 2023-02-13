FROM public.ecr.aws/docker/library/node:19-alpine  As development

RUN apk update && apk add python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install -g pnpm

WORKDIR /usr/src/app
COPY package*.json ./

RUN pnpm install
COPY . .

RUN pnpm build

FROM public.ecr.aws/docker/library/node:19-alpine As production

RUN apk update && apk add python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install -g pnpm

WORKDIR /usr/src/app
COPY package*.json ./

RUN pnpm install --production

COPY . .
COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/main" ]
