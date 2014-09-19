var mongoose = require('mongoose');

process.env.NODE_ENV = 'test';

beforeEach(function(done){
    console.log("cleaning db before");
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function(){});
    }
    return done();
});

afterEach(function(done){
    console.log("cleaning db after");
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function(){});
    }
    return done();
});

var app = require('../../server'),
    request = require('supertest'),
    server = request.agent(app),
    should = require('should');


var logInAsTech = function(done, technicianCredentials){
    request(app)
    .post('/auth/session')
    .send({ email: technicianCredentials.email, password: technicianCredentials.password})
    .expect(200)
    .end(function(err, res){
        if (err) return done(err);
        server.saveCookies(res);
        done();
    });
};

var logInAsAdmin = function(done){
    request(app)
    .post('/auth/session')
    .send({ email: "admin@example.com", password: "secret"})
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
exports.logInAsTech = logInAsTech;
exports.logInAsAdmin = logInAsAdmin;