var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

module.exports = function(configuration){

  var sendgrid   = require('sendgrid')(configuration.sendgrid_username, configuration.sendgrid_password);

  return {

    sendMail: function (to, from, subject, text, html, substitution, headersList, file){
      
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

      // sending email

      sendgrid.send(email, function(err, json) {
        if (err) { return {status: RESULT_ERROR};}
        return {status: RESULT_SUCCESS};
      });
    }
  }
};