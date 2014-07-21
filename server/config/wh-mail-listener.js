var config = require('./config');

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";
var MailListener = require("mail-listener2");

module.exports = function(configuration){
  var mailListener = new MailListener(configuration);

  return {
    start: mailListener.start(),
    onMailReceived: function(process){
      mailListener.on("mail", function(mail, seqno, attributes){
        console.log(mail);
        process(mail.from[0].address, mail.to[0].address, mail.subject, mail.text).then(function (processResult){
          if (processResult.Status == RESULT_SUCCESS){
            console.log("Email processed", mail.subject);
            // Mark email as Seen
            mailListener.imap.addFlags(attributes.uid, '\\Seen', function(err) {
              if(!err) {
                console.log('mail marked as read');
              }
            });
          }
          else if (processResult.Status == RESULT_ERROR){
            console.log("Email not processed");
          } 
        });
      });
    }  
  }
};