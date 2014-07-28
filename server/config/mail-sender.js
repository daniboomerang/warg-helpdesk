var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";
var Q = require('q');


module.exports = function(configuration){

  var sendgrid   = require('sendgrid')(configuration.sendgrid_username, configuration.sendgrid_password);

  return {

    sendMail: function (to, from, subject, text, html, substitution, headersList, file){
      
      var deferred = Q.defer();

      var email = new sendgrid.Email();

      // Setting up email parameters

      email.addTo(to);
      if (from) email.setFrom(from); else email.setFrom(configuration.support_Helpdesk);
      email.setSubject(subject);
      email.setText(text);
      if (html) email.setHtml(html);
      if (substitution) email.addSubstitution(substitution);
      if (headersList) for (var i=0; i<headersList.lenght; i++){
        email.addHeader(headersList[i]);
      }
      if (file) email.addFile(file);

console.log("console log mailSender: ", from, to, subject);

      // sending email

      sendgrid.send(email, function(err, json) {
console.log("sendgrid callback: ", err, json);
        if (err) {deferred.resolve({status: RESULT_ERROR});}
        else {deferred.resolve({status: RESULT_SUCCESS})};
      });

      return deferred.promise;
    }
  }
};