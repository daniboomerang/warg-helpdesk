'use strict';

var HELPER = require('../fixtures/fixtures-helper')

var FIXTURE = require('../fixtures/disable-inventory-item-fixture')

describe('Disable Inventory Item', function () {

    this.timeout(6000);

    beforeEach(function(done){
        HELPER.logInAsTech(done);
    });

    it('retrieves success when no problem', function (done) {
        HELPER.put('/api/inventory/'+ FIXTURE.inventoryItemId + '/disable')
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });

    it('makes it unavailable on inventory index', function (done) {
        HELPER.put('/api/inventory/'+ FIXTURE.inventoryItemId + '/disable')
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            HELPER.get('/api/inventory')
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                res.body.length.should.eql(1);
                done();
            });
        });
    });
});
