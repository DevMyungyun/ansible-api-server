const jobeventHelper = require("../helper/jobevent");
const request = require("supertest");
const should = require('should'); 

var server = require("../app.js");

const jb = new jobeventHelper().build();


describe('Job Test', function () {
    const addr = 'http://localhost:8888';

    before(function () {
        server.listen(8888);
    });

    it('job event test', function (done) {
        const data = {
            'tid': 1
        };
        request(addr)
            .post("/v1/jobevent/adhoc")
            .send(data)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                console.log(res);
                res.body.code.should.be.equal('a001');
                done();
            });
            done();
    })
    
});