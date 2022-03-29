class HostBuilder {
    constructor(name, 
                content, 
                domain, 
                os, 
                ip, 
                datasource,
                datacenter,
                use_yn,
                iid)   {
        this.name       = name;
        this.content    = content;
        this.domain     = domain;
        this.os         = os;
        this.ip         = ip;
        this.datasource = datasource;
        this.datacenter = datacenter;
        this.use_yn     = use_yn;
        this.iid        = iid;
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
    setIid       (iid) {
        this.iid = iid;
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
        if(!('iid' in this) || typeof this.iid === 'undefined') {
            throw new Error("There is no iid parameter...")
        }

        return new CredBuilder(this.name,
                            this.content,
                            this.mid,
                            this.mpw,
                            this.private_key,
                            this.type)
    }

}

module.exports = CredBuilder;