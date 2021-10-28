FROM node:14.15.1-alpine

RUN apk --no-cache add tzdata
RUN cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN echo "Asia/Seoul" >  /etc/timezone

WORKDIR /home/automation-server

# npm install
COPY ./package.json /home/automation-server/package.json

RUN npm install -g pm2

# source copy
COPY ./ /home/automation-server
COPY ./kubernetes/dev/pm2.json /home/pm2-app.json
