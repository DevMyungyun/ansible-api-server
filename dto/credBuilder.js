class CredBuilder {
    constructor(name, 
                content, 
                mid, 
                mpw, 
                private_key, 
                type) {
        this.name       = name;
        this.content    = content;
        this.mid        = mid 
        this.mpw        = mpw;
        this.private_key= private_key;
        this.type       = type;
    }

    setName        (name) {
        this.name = name;
        return this;
    }
    setContent     (content) {
        this.content = content;
        return this;
    }
    setMid         (mid) {
        this.mid = mid;
        return this;
    }
    setMpw       (mpw) {
        this.mpw = mpw;
        return this;
    }
    setPrivate_key       (private_key) {
        this.private_key = private_key;
        return this;
    }
    setType      (type) {
        this.type = type;
        return this;
    }
    
    build() {
        if(!('name' in this) || typeof this.name === 'undefined') {
            throw new Error("There is no name parameter...")
        }
        if(!('content' in this) || typeof this.content === 'undefined') {
            throw new Error("There is no content parameter...")
        }
        if(!('mid' in this) || typeof this.mid === 'undefined') {
            throw new Error("There is no mid parameter...")
        }
        if(!('mpw' in this) || typeof this.mpw === 'undefined') {
            throw new Error("There is no mpw parameter...")
        }
        if(!('private_key' in this) || typeof this.private_key === 'undefined') {
            throw new Error("There is no private_key parameter...")
        }
        if(!('type' in this) || typeof this.type === 'undefined') {
            throw new Error("There is no type parameter...")
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