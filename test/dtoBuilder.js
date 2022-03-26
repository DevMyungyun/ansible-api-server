const AdhocBuilder = require('../dto/adhocBuilder')

describe('Builder Test', function() {
    it('adhocBuilder build', function (done) {
        const adhocBuilder = new AdhocBuilder().setVname('hello1')
                                .setVcontent('hello2')
                                .build();
        console.log(adhocBuilder);
        done();
    })

    it('adhocBuilder error', function (done) {
        const adhocBuilder = new AdhocBuilder().setVname('hello1')
                                                .build();
        // console.log(adhocBuilder.vcontent);
        done();
    })
})


