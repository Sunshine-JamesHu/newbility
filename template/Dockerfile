FROM node:17.8.0-alpine AS base
WORKDIR /app
EXPOSE 6666

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk update && apk add tzdata
ENV TZ=Asia/Shanghai

COPY ./build .

RUN yarn --production --registry=https://registry.npmmirror.com

ENTRYPOINT ["node", "/app/src/App.js"]


