'use strict';

process.env.NODE_ENV = 'test';

var app = require('../../server'),
    request = require('supertest'),
    server = request.agent(app),
    should = require('should');

require('./utils');
require('./incidences-reporting-fixture');

describe('Incidences Reporting', function () {

    this.timeout(6000);

    before(function(done){
        logIn(done);
    });

    it('displays the general dashboard for incidences', function (done) {
        server.get('/api/reports/incidences')
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            // It checks that the server returns an array with 3 elements
            res.body.length.should.eql(3);
            done();
        });
    });
});

var logIn = function(done){
    console.log("loging in");
    server
    .post('/auth/session')
    .send({ email: "admin@example.com", password: "secret"})
    .expect(200)
    .end(function(err, res){
        if (err) {
                    console.log("Not logged");
                    console.log(err);

            return done(err);
        }    
        console.log("logged");
        done();
    });
}