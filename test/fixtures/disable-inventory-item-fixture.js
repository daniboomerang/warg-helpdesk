'use strict';

process.env.NODE_ENV = 'test';

var config = require('../../server/config/config');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var School = mongoose.model("School");
var Inventory = mongoose.model("Inventory");

var FIXTURE = {};
FIXTURE.loggedUserCredentials = {email: "tecnicodisable@example.com", password: "secret"};

beforeEach(function (done) {
  inventoryIndexAsTechnicianFixture(done);
});

var Technician = {
    email: FIXTURE.loggedUserCredentials.email,
    password: FIXTURE.loggedUserCredentials.password,
    role: "tech",
    username: "tecnicodisable"
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
    console.log("going to create fixture");
    var school = new School(SchoolData);
    school.save(function(err){});

    Pc.schoolId = school._id;
    var pc = new Inventory(Pc);
    pc.save();
    FIXTURE.inventoryItemId = pc._id;

    Printer.schoolId = school._id;
    var printer = new Inventory(Printer);
    printer.save();

    Monitor.schoolId = "other school id";
    var monitor = new Inventory(Monitor);
    monitor.save();

    Technician.school = school;
    var user = new User(Technician);
    user.save(done);
    console.log("fixture created");
};

module.exports = FIXTURE;
