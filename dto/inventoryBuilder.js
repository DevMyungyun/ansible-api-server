class inventoryBuilder {
    constructor(name, 
                content, 
                use_yn)   {
        this.name       = name;
        this.content    = content;
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
        if(!('use_yn' in this) || typeof this.use_yn === 'undefined') {
            throw new Error("There is no use_yn parameter...")
        }

        return new inventoryBuilder(this.name,
                            this.content,
                            this.use_yn)
    }

}

module.exports = inventoryBuilder;