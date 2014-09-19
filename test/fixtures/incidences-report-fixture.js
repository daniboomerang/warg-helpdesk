'use strict';

process.env.NODE_ENV = 'test';

var config = require('../../server/config/config');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var School = mongoose.model("School");
var Incidence = mongoose.model("Incidence");

var STATUS_ONGOING = "On Going";
var STATUS_CLOSED = "Closed";
var STATUS_OPEN = "Open"

var FIXTURE = {};
FIXTURE.loggedUserCredentials = {email: "tecnicodisable@example.com", password: "secret"};

beforeEach(function (done) {
  incidencesReportFixture(done);
});

var TechniciansDataList = function(schoolsIds){

    var technicians = function(){
        var techniciansList = [];
        for (var i=0; i<=9; i++){
            var currentUsername = "tech" + i;
            var currentTechnician = {
                email: "tech" + i + "@example.com",
                password: "secret",
                role: "tech",
                username: currentUsername,
                school: schoolsIds[i % schoolsIds.length]
            };
            techniciansList.push(currentTechnician);
        }
        return techniciansList;
    };

    return technicians;
};

var SchoolsDataList = function(){

    var schools = [];
    var school1 = {
        name: "School-1",
        code: "SH1",
        address: "Gran Via, 1, Madrid"
    };
    var school2 = {
        name: "School-2",
        code: "SH2",
        address: "Gran Via, 2, Madrid"
    };
    schools.push(school1);
    schools.push(school2);
    return schools;
};

var IncidencesDataList = function(schoolsCodes, schoolsIds, usersIds){

    var incidences = [];

    // 8 Open 
    for (var i=0; i<=7; i++){

        var currentIncidence = {
            id: schoolsCodes[i % schoolsCodes.length] + "-" + i,
            title: "Title-" + i,
            description : "Description-" + i,
            severity : "Low",
            priority : "Low",
            creator : usersIds[i % usersIds.length],
            school : schoolsIds[i % schoolsIds.length],
            status : {
                currentStatus: STATUS_OPEN,
                currentSubstatus: '',
                duplicatedOf: null,
                blockedBy: null
            }
        };
        incidences.push(currentIncidence);
    };

    // 8 On Going 
    for (i; i<=15; i++){

        var currentIncidence = {
            id: schoolsCodes[i % schoolsCodes.length] + "-" + i,
            title: "Title-" + i,
            description : "Description-" + i,
            severity : "Medium",
            priority : "Medium",
            creator : usersIds[i % usersIds.length],
            school : schoolsIds[i % schoolsIds.length],
            status : {
                currentStatus: STATUS_ONGOING,
                currentSubstatus: '',
                duplicatedOf: null,
                blockedBy: null
            }
        };
        incidences.push(currentIncidence);
    };


        // 8 On Going 
    for (i; i<=23; i++){

        var currentIncidence = {
            id: schoolsCodes[i % schoolsCodes.length] + "-" + i,
            title: "Title-" + i, 
            description : "Description-" + i,
            severity : "Serious",
            priority : "Serious",
            creator : usersIds[i % usersIds.length],
            school : schoolsIds[i % schoolsIds.length],
            status : {
                currentStatus: STATUS_CLOSED,
                currentSubstatus: 'Solved',
                duplicatedOf: null,
                blockedBy: null
            }
        };
        incidences.push(currentIncidence);
    };
    return incidences;
};

var incidencesReportFixture = function(done){

    // It creates 2 Schools
    var schools = SchoolsDataList();
    var schoolsIds = [];
    var schoolsCodes = [];
    // Creating Schools
    for (var i = 0; i <= schools.length-1; i++ ){
        var school = new School(schools[i]);
        school.save();
        schoolsIds.push(school._id);
        schoolsCodes.push(school.code);
    }
    // It creates 10 Technicians
    var users = TechniciansDataList(schoolsIds);
    var usersIds = [];
    // Creating Users
    for (var i = 0; i <= users.length-1; i++ ){
        var user = new User(users[i]);
        user.save();
        usersIds.push(user._id);
    }
    // It creates 24 incidences (8 Open, 8 On going, 8 Closed)
    var incidences = IncidencesDataList(schoolsCodes, schoolsIds, usersIds);
    // Creating incidences
    for (var i = 0; i <= incidences.length-1; i++){ 
      
        var incidence = new Incidence(incidences[i]);

        if (i == incidences.length - 1){
            incidence.save();
        }
        else{
            incidence.save();
        }
    }

    // And finally the Admin, and when this one is created, we call done()
    var Admin = {
        email: "admin@example.com",
        password: "secret",
        role: "admin",
        username: "admin"
    };

    var admin = new User(Admin);
    admin.save(done);
};

module.exports = FIXTURE;
