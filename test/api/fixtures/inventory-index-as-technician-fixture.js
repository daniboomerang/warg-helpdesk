'use strict';

process.env.NODE_ENV = 'test';

var config = require('../../../server/config/config');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var School = mongoose.model("School");
var Inventory = mongoose.model("Inventory");

beforeEach(function (done) {
  inventoryIndexAsTechnicianFixture(done);
});

afterEach(function(done){
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function(){});
    }
    return done();
});

var Technician = {
    email: "tecnico@example.com",
    password: "secret",
    role: "tech",
    username: "tecnico"
};

var SchoolData = {
    name: "School name",
    code: "COD",
    address: "Gran Via, Madrid"
};

var Pc = {
    serial: "aksdfañlsfjañsf",
    internalId: "PC-1",
    kind: "PC",
    acquisitionDate: new Date()
};

var Printer = {
    serial: "aksdfañlsfjañsf",
    internalId: "PRINTER-1",
    kind: "PRINTER",
    acquisitionDate: new Date()
};

var Monitor = {
    serial: "aksdfañlsfjañsf",
    internalId: "MONITOR-1",
    kind: "MONITOR",
    acquisitionDate: new Date()
};

var inventoryIndexAsTechnicianFixture = function(done){
    var school = new School(SchoolData);
    school.save(function(err){});

    Pc.schoolId = school._id;
    var pc = new Inventory(Pc);
    pc.save();

    Printer.schoolId = school._id;
    var printer = new Inventory(Printer);
    printer.save();

    Monitor.schoolId = "other school id";
    var monitor = new Inventory(Monitor);
    monitor.save();

    Technician.school = school;
    var user = new User(Technician);
    user.save(done);
};

