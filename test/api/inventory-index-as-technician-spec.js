'use strict';

process.env.NODE_ENV = 'test';

var app = require('../../server'),
    request = require('supertest'),
    server = request.agent(app),
    should = require('should');

require('./utils');
require('./inventory-index-as-technician-fixture');

describe('Inventory Index', function () {

    this.timeout(6000);

    before(function(done){
        logIn(done);
    });

    it('displays the available inventory items', function (done) {
        server.get('/api/inventory')
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            res.body.length.should.eql(2);
            done();
        });
    });
});

var logIn = function(done){
    server
    .post('/auth/session')
    .send({ email: "tecnico@example.com", password: "secret"})
    .expect(200)
    .end(function(err, res){
        if (err) return done(err);
        done();
    });
}