const CredBuilder = require('../dto/credBuilder')

describe('Builder Test', function() {
    it('credBuilder build', function (done) {
        const credBuilder = new CredBuilder().setName('test')
                                .setContent('test...')
                                .setMpw('pw')
                                .setMid('mid')
                                .setType('vmware')
                                .setPrivate_key('privatekeeeeey')
                                .build();
        console.log(credBuilder);
        done();
    })

    it('credBuilder error', function (done) {
        const credBuilder = new CredBuilder().setName('hello1')
                                                .build();
        done();
    })
})


