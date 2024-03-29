FROM node:12-alpine3.14

ENV ANSIBLE_VERSION 2.7.4
ENV ANSIBLE_LINT 3.5.1
ENV DOCKER_PY_VERSION 1.10.6

RUN apk update && apk --no-cache add net-tools tzdata
RUN cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN echo "Asia/Seoul" >  /etc/timezone

# ansible install
RUN apk add --update python2 python3 py-pip python2-dev python3-dev
RUN apk add --update openssl ca-certificates bash git sudo zip \
    && apk --update add --virtual build-dependencies libffi-dev openssl-dev build-base \
    && pip install --upgrade pip cffi \
    && echo "Installing Ansible..." \
    && pip install ansible==$ANSIBLE_VERSION ansible-lint==$ANSIBLE_LINT docker-py==$DOCKER_PY_VERSION \
    && pip install --upgrade pycrypto pywinrm  \
    && apk --update add sshpass openssh-client rsync \
    && echo "Removing package list..." \
    && apk del build-dependencies \
    && rm -rf /var/cache/apk/* 

WORKDIR /home/automation-server

RUN npm install -g pm2

# source copy
COPY ./ /home/automation-server
