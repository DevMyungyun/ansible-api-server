# Ansible RESTful API Server

This is RESTful API web server with Ansible. You can execute Ansible ADHOC, Playbook using this API server. If you want to give me a feedback, Please leave a comment on 'Discussions'!

## Getting Started

This web server for control Ansible with PostgreSQL database.

### Prerequisites
* Node.js Version v12.xx.x

OS
* Redhat or CentOS(recommand)

Solution
* Ansible

Database
* PostgreSQL

### Globally npm install 

Install itmsg-automation globally

```
$ npm i itmsg_automation -g
```

start itmsg_automation web server

NPM URL : https://www.npmjs.com/package/itmsg_automation


### Configuration

Open config.json file and edit PostgreSQL connection informations and Ansible's
file path for playbooks.

### Automation Portal

You can manage itmsg_automation api server with automation web. Check out this portal if you are interested.

Automation Portal URL : [https://github.com/myungyun/itmsg_automation-web](https://github.com/myungyun/itmsg_automation-web)

### Docker Container

Also check out docker container.

itmsg_automation dockerhub URL : [https://hub.docker.com/repository/docker/jokun1178/itmsg_automation](https://hub.docker.com/repository/docker/jokun1178/itmsg_automation)
