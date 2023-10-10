FROM node:20 as build-stage
LABEL authors="haojiachen"

WORKDIR /app

#RUN npm config set registry https://registry.npmmirror.com
#
#RUN npm install -g pnpm
#
#COPY package.json pnpm-lock.yaml ./
#
#RUN pnpm install

COPY . .

RUN yarn && yarn build

#RUN pnpm build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
