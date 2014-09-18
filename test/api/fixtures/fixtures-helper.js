process.env.NODE_ENV = 'test';

var app = require('../../../server'),
    request = require('supertest'),
    server = request.agent(app),
    should = require('should');


var logIn = function(done){
    request(app)
    .post('/auth/session')
    .send({ email: "tecnico@example.com", password: "secret"})
    .expect(200)
    .end(function(err, res){
        if (err) return done(err);
        server.saveCookies(res);
        done();
    });
};

var put = function(url){
    var req = request(app).put(url);
    server.attachCookies(req);
    return req;
};

var get = function(url){
    var req = request(app).get(url);
    server.attachCookies(req);
    return req;
};

exports.should = should;
exports.get = get;
exports.put = put;
exports.logIn = logIn;