class AdhocBuilder {
    constructor(name, 
                content, 
                iid, 
                iname, 
                cname, 
                playbook,  
                forks, 
                limits, 
                verb, 
                variables, 
                use_yn) {
        this.name      = name;
        this.content   = content;
        this.iid       = iid;
        this.iname     = iname;
        this.cname     = cname;
        this.playbook    = playbook;
        this.forks     = forks;
        this.limits    = limits;
        this.verb      = verb;
        this.variables = variables;
        this.use_yn    = use_yn;
    }

    setName        (name) {
        this.name = name;
        return this;
    }
    setContent     (content) {
        this.content = content;
        return this;
    }
    setIid         (iid) {
        this.iid = iid;
        return this;
    }
    setIname       (iname) {
        this.iname = iname;
        return this;
    }
    setCname       (cname) {
        this.cname = cname;
        return this;
    }
    setPlaybook      (playbook) {
        this.playbook = playbook;
        return this;
    }
    setForks       (forks) {
        this.forks = forks;
        return this;
    }
    setLimits      (limits) {
        this.limits = limits;
        return this;
    }
    setVerb        (verb) {
        this.verb = verb;
        return this;
    }
    setVariables   (variables) {
        this.variables = variables;
        return this;
    }
    setUse_yn      (use_yn) {
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
        if(!('iid' in this) || typeof this.iid === 'undefined') {
            throw new Error("There is no iid parameter...")
        }
        if(!('iname' in this) || typeof this.iname === 'undefined') {
            throw new Error("There is no iname parameter...")
        }
        if(!('cname' in this) || typeof this.cname === 'undefined') {
            throw new Error("There is no cname parameter...")
        }
        if(!('playbook' in this) || typeof this.playbook === 'undefined') {
            throw new Error("There is no playbook parameter...")
        }
        if(!('forks' in this) || typeof this.forks == 'undefined') {
            throw new Error("There is no forks parameter...")
        }
        if(!('verb' in this) || typeof this.verb === 'undefined') {
            throw new Error("There is no verb parameter...")
        }

        return new AdhocBuilder(this.name,
                            this.content,
                            this.iid,
                            this.iname,
                            this.cname,
                            this.playbook,
                            this.forks,
                            this.limits,
                            this.verb,
                            this.variables,
                            this.use_yn)
    }

}

module.exports = AdhocBuilder;