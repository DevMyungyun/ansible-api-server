FROM alpine:3.12
MAINTAINER MYUNG YUN<myungyuncho82@gmail.com>

ENV WEBPORT $WEBPORT
ENV DBSERVER $DBSERVER
ENV DBUSER $DBUSER
ENV DBPASS $DBPASS
ENV DATABASE $DATABASE
ENV DBPORT $DBPORT
ENV FILESTORAGE $FILESTORAGE
ENV PLAYBOOK $PLAYBOOK

ENV PLAYBOOK /root/z
RUN apk add --no-cache musl-dev python3-dev openssl-dev libffi-dev gcc
RUN pip3 install --upgrade pip
RUN pip install cffi
RUN pip install ansible
RUN ansible --version

RUN apk add --update nodejs npm
RUN node --version
RUN npm -version

RUN npm i itmsg_automation@latest -g

VOLUME ["/data"]

ENTRYPOINT node /usr/lib/node_modules/itmsg_automation/bin/automation.js $WEBPORT $DBSERVER $DBUSER $DBPASS $DATABASE $DBPORT $FILESTORAGE $PLAYBOOK

EXPOSE $WEBPORT