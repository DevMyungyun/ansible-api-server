class HostBuilder {
    constructor(name, 
                content, 
                domain, 
                os, 
                ip, 
                datasource,
                datacenter,
                use_yn,)   {
        this.name       = name;
        this.content    = content;
        this.domain     = domain;
        this.os         = os;
        this.ip         = ip;
        this.datasource = datasource;
        this.datacenter = datacenter;
        this.use_yn     = use_yn;
    }

    setName        (name) {
        this.name = name;
        return this;
    }
    setContent     (content) {
        this.content = content;
        return this;
    }
    setDomain         (domain) {
        this.domain = domain;
        return this;
    }
    setOs         (os) {
        this.os = os;
        return this;
    }
    setIp       (ip) {
        this.ip = ip;
        return this;
    }
    setDatasource       (datasource) {
        this.datasource = datasource;
        return this;
    }
    setDatacenter      (datacenter) {
        this.datacenter = datacenter;
        return this;
    }
    setUse_yn        (use_yn) {
        this.use_yn = use_yn;
        return this;
    }
    
    build() {
        if(!('name' in this) || typeof this.name === 'undefined') {
            throw new Error("There is no name parameter...")
        }
        if(!('content' in this) || typeof this.content === 'undefined') {
            throw new Error("There is no content parameter...")
        }
        if(!('domain' in this) || typeof this.domain === 'undefined') {
            throw new Error("There is no domain parameter...")
        }
        if(!('os' in this) || typeof this.os === 'undefined') {
            throw new Error("There is no os parameter...")
        }
        if(!('ip' in this) || typeof this.ip === 'undefined') {
            throw new Error("There is no ip parameter...")
        }
        if(!('datasource' in this) || typeof this.datasource === 'undefined') {
            throw new Error("There is no datasource parameter...")
        }
        if(!('datacenter' in this) || typeof this.datacenter === 'undefined') {
            throw new Error("There is no datacenter parameter...")
        }
        if(!('use_yn' in this) || typeof this.use_yn === 'undefined') {
            throw new Error("There is no use_yn parameter...")
        }

        return new HostBuilder(this.name,
                            this.content,
                            this.domain,
                            this.os,
                            this.ip,
                            this.datasource,
                            this.datacenter,
                            this.use_yn)
    }

}

module.exports = HostBuilder;