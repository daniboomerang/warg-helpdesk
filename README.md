Warg-Helpdesk-Beta
==================

An AngularJS application that uses Express, Passport, MongoDB. with: 

* Authentication multiple roles using Passport
* Account creation and server validation with Mongoose.
* CRUD interface for creating incidences with MongoDB
* Client validations for account creation including a directive for validating if a username is available.
* Authorization middleware for checking specific rights (role) for specific API services. 
* Unit tests for client code

## Live Example
Try out the app: 

## How to use warg-helpdesk-beta

Before you continue, make sure you have MongoDB installed <http://www.mongodb.org/downloads/>. 

### Setup
Run `npm install`, followed by `bower install` to grab the dependencies.

### Running the app
Run `grunt server` to start the app in development mode with livereload, or run `grunt server:dist` to run it in a minified and optimized production build.

### Testing
Run `grunt test` to start the karma test runner.

## Directory structure:
Warg Helpdesk is structured by Featured or Module.
(See https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub)

    +---server.js           -> Bootstrap Server
    |
    +---client                 -> Client
    |   +---scripts
    |   |   +---controllers
    |   |   +---directives
    |   |   \---services
    |   |
    |   +---styles
    |   \---views
    |
    |   +---modules
    |   |   +--- auth
    |   |        +---scripts
    |   |           +---controllers
    |   |           +---directives
    |   |           \---services
    |   |        +---styles
    |   |        \---views
    |   |   +--- incidences
    |   |   +--- inventory
    |   |   +--- userManagement
    |   |   +--- schoolManagement
    |
    +---server                 -> Server
    |   +---config
    |   +---controllers
    |   +---db
    |   \---models
    |           
    +---test                -> Client unit tests
