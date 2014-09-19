'use strict';

var HELPER = require('../fixtures/fixtures-helper')

require('../fixtures/incidences-report-fixture');

describe('Incidences Reporting', function () {

    this.timeout(6000);

    beforeEach(function(done){
        HELPER.logInAsAdmin(done);
    });

    it('displays the general dashboard for incidences', function (done) {
        HELPER.get('/api/reports/incidences')
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
