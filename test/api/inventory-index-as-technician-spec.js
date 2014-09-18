'use strict';

var HELPER = require('./fixtures/fixtures-helper')

require('./fixtures/inventory-index-as-technician-fixture');

describe('Inventory Index', function () {

    this.timeout(6000);

    beforeEach(function(done){
        HELPER.logIn(done);
    });

    it('displays the available inventory items', function (done) {
        HELPER.get('/api/inventory')
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            res.body.length.should.eql(2);
            done();
        });
    });
});

