'use strict';

var HELPER = require('../fixtures/fixtures-helper')

var FIXTURE = require('../fixtures/inventory-index-as-technician-fixture');

describe('Inventory Index', function () {

    this.timeout(6000);

    beforeEach(function(done){
        var technicianCredentials = FIXTURE.loggedUserCredentials;
        HELPER.logInAsTech(done, technicianCredentials);
    });

    it('displays the available inventory items from his school', function (done) {
        HELPER.get('/api/inventory')
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            res.body.length.should.eql(3);
            done();
        });
    });
});

