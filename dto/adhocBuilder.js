class AdhocBuilder {
    constructor(vname, 
                vcontent, 
                viid, 
                viname, 
                vcname, 
                vmodule, 
                varg, 
                vforks, 
                vlimits, 
                vverb, 
                vvariables, 
                vuse_yn) {
        this.vname      = vname;
        this.vcontent   = vcontent;
        this.viid       = viid;
        this.viname     = viname;
        this.vcname     = vcname;
        this.vmodule    = vmodule;
        this.varg       = varg;
        this.vforks     = vforks;
        this.vlimits    = vlimits;
        this.vverb      = vverb;
        this.vvariables = vvariables;
        this.vuse_yn    = vuse_yn;
    }

    setVname        (vname) {
        this.vname = vname;
        return this;
    }
    setVcontent     (vcontent) {
        this.vcontent = vcontent;
        return this;
    }
    setViid         (viid) {
        this.viid = viid;
        return this;
    }
    setViname       (viname) {
        this.viname = viname;
        return this;
    }
    setVcname       (vcname) {
        this.vcname = vcname;
        return this;
    }
    setVmodule      (vmodule) {
        this.vmodule = vmodule;
        return this;
    }
    setVarg         (varg) {
        this.varg = varg;
        return this;
    }
    setVforks       (vforks) {
        this.vforks = vforks;
        return this;
    }
    setVlimits      (vlimits) {
        this.vlimits = vlimits;
        return this;
    }
    setVverb        (vverb) {
        this.vverb = vverb;
        return this;
    }
    setVvariables   (vvariables) {
        this.vvariables = vvariables;
        return this;
    }
    setVuse_yn      (vuse_yn) {
        this.vuse_yn = vuse_yn;
        return this;
    }   
    
    build() {
        if(!('vname' in this) || typeof this.vname === 'undefined') {
            throw new Error("There is no vname parameter...")
        }
        if(!('vcontent' in this) || typeof this.vcontent === 'undefined') {
            throw new Error("There is no vcontent parameter...")
        }
        if(!('viid' in this) || typeof this.viid === 'undefined') {
            throw new Error("There is no viid parameter...")
        }
        if(!('viname' in this) || typeof this.viname === 'undefined') {
            throw new Error("There is no viname parameter...")
        }
        if(!('vcname' in this) || typeof this.vcname === 'undefined') {
            throw new Error("There is no vcname parameter...")
        }
        if(!('vmodule' in this) || typeof this.vmodule === 'undefined') {
            throw new Error("There is no vmodule parameter...")
        }
        if(!('vforks' in this) || typeof this.vforks == 'undefined') {
            throw new Error("There is no vforks parameter...")
        }
        if(!('vverb' in this) || typeof this.vverb === 'undefined') {
            throw new Error("There is no vverb parameter...")
        }

        return new AdhocBuilder(this.vname,
                            this.vcontent,
                            this.viid,
                            this.viname,
                            this.vcname,
                            this.vmodule,
                            this.varg,
                            this.vforks,
                            this.vlimits,
                            this.vverb,
                            this.vvariables,
                            this.vuse_yn)
    }

}

module.exports = AdhocBuilder;