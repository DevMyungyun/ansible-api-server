class inventoryBuilder {
    constructor(iid, 
                iname, 
                tid,
                tname,
                status)   {
        this.iid       = iid;
        this.iname    = iname;
        this.tid     = tid;
        this.tname     = tname;
        this.status     = status;

    }

    setIid        (iid) {
        this.iid = iid;
        return this;
    }
    setIname     (iname) {
        this.iname = iname;
        return this;
    }
    setTid        (tid) {
        this.tid = tid;
        return this;
    }
    setTname        (tname) {
        this.tname = tname;
        return this;
    }
    setStatus        (status) {
        this.status = status;
        return this;
    }

    build() {
        if(!('iid' in this) || typeof this.iid === 'undefined') {
            throw new Error("There is no iid parameter...")
        }
        if(!('iname' in this) || typeof this.iname === 'undefined') {
            throw new Error("There is no iname parameter...")
        }
        if(!('tid' in this) || typeof this.tid === 'undefined') {
            throw new Error("There is no tid parameter...")
        }
        if(!('tname' in this) || typeof this.tname === 'undefined') {
            throw new Error("There is no tname parameter...")
        }
        if(!('status' in this) || typeof this.status === 'undefined') {
            throw new Error("There is no status parameter...")
        }

        return new inventoryBuilder(this.iid,
                            this.iname,
                            this.tid,
                            this.tname,
                            this.status)
    }

}

module.exports = inventoryBuilder;