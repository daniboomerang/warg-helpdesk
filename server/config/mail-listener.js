var config = require('./config');

var RESULT_SUCCESS = "SUCCESS";
var RESULT_WARNING = "WARNING";
var RESULT_ERROR = "ERROR";

var MailListener = require('mail-listener2');

module.exports = function(configuration){
  var mailListener = new MailListener(configuration);

  return {
    start: mailListener.start(),
    onMailReceived: function(processIncoming){
      mailListener.on("mail", function(mail, seqno, attributes){
        processIncoming(mail.from[0].address, mail.to[0].address, mail.subject, mail.text).then(function (processResult){
          if (processResult.status != RESULT_ERROR){
            if (processResult.status == RESULT_WARNING){console.log('Email: ', mail.subject, 'processed with errors.');}  
            else {console.log('Email: ', mail.subject, 'processed without errors.');} //(processResult.status == RESULT_SUCCESS)
            // Mark email as Seen
            mailListener.imap.addFlags(attributes.uid, '\\Seen', function(err) {
              if(!err) {
                console.log('mail marked as read');
              }
            });
          }
          else {console.log('Email: ', mail.subject, 'Not processed.');}//(processResult.status == RESULT_ERROR)
        });
      });
    }  
  }
};