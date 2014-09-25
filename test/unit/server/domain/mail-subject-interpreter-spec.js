var interpreter = require('../../../../server/domain/mail-subject-interpreter');
var should = require('should');

describe("Domain Mail Subject Interpreter", function(){
  it("retrieves an incidence id on creation notification mail subject response", function(){
    var extracted = interpreter.extractId("Re: TAV-28 # local 66");
    extracted.should.be.exactly("TAV-28");
  });
  it("retrieves an incidence id on comment notification mail subject response", function(){
    var extracted = interpreter.extractId("Re: New Comment on TAV-28 # local 66");
    extracted.should.be.exactly("TAV-28");
  });
});