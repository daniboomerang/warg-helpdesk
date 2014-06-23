Warg-Helpdesk-Beta
==================

An AngularJS application that uses Express, Passport, MongoDB. with: 

* Authentication multiple roles using Passport
* Account creation and server validation with Mongoose.
* CRUD interface for creating incidences with MongoDB
* Authorization middleware for checking specific rights (role) for specific API services. 
* Unit tests for client code
* Unit tests for server code
* e2e tests

## Live Example
Try out the app: 

## How to use warg-helpdesk-beta

Before you continue, make sure you have MongoDB installed <http://www.mongodb.org/downloads/>. 

### Setup
Run `npm install`, followed by `bower install` to grab the dependencies.

### Running the app
Run `npm start` to start the app.

### Testing
Run `npm test` to start the karma test runner.

## Directory structure:
Warg Helpdesk is structured by Featured or Module.
(See https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub)

    +--- server.js           -> Bootstrap Server
    |
    +--- client                 -> Client
    |   +--- scripts
    |   |   \--- controllers
    |   |   \--- directives
    |   |   \--- services
    |   |
    |   \--- styles
    |   \--- views
    |
    |   +--- modules
    |   |   +--- common 
    |   |   |   +--- auth
    |   |   |       +--- scripts
    |   |   |           \--- controllers
    |   |   |           \--- directives
    |   |   |           \--- services
    |   |   |       \--- styles
    |   |   |       \--- views
    |   |   |   \--- desk
    |   |   |
    |   |   \--- incidences
    |   |   \--- inventory
    |   |   \--- userManagement
    |   |   \--- schoolManagement
    |
    +--- server                 -> Server
    |   \--- config
    |   \--- controllers
    |   \--- db
    |   \--- models
    |           
    +--- test                   -> Client unit tests
    |   +--- unit
    |   |   +--- client
    |   |   |   \--- controllers
    |   |   |   \--- services
    |   |   |   \--- directives
    |   |   |   +--- modules
    |   |   |       \--- auth
    |   |   |
    |   |   +--- server
    |   |       \--- config
    |   |       \--- controllers
    |   |       \--- models
    |   |
    |   \--- e2e
    |   +--- test_report
    |   |   \--- client        
    |   |   \--- server

                    


