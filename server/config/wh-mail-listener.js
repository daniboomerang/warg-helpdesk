var config = require('./config');

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";
var MailListener = require("mail-listener2");

module.exports = function(configuration){
  var mailListener = new MailListener(configuration);

  return {
    start: mailListener.start(),
    onMailReceived: function(processMail){
      mailListener.on("mail", function(mail, seqno, attributes){
        console.log(mail);
        processMail(mail.from[0].address, mail.to[0].address, mail.subject, mail.text).then(function (processResult){
          if (processResult.Status == RESULT_SUCCESS){
            console.log("Email processed", mail);
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

// function MailListener(configuration){
//   this.mailListener = new MailListenerAdapter(configuration);
// };

// MailListener.prototype.start = function(){
//   this.mailListener.start();
// };

// MailListener.prototype.onMailReceived = function(whatToDo){
//   this.mailListener.on("mail", function(mail, seqno, attributes){
//     var result = whatToDo(sender, receiver, subject, content);
//     if (result.Status == RESULT_SUCCESS){
//       console.log("Email succesfully processed", mail);
//       // Mark email as Seen
//       this.mailListener.imap.addFlags(mail.uid, '\\Seen', function(err) {
//         if(!err) {
//           console.log('mail marked as read');
//         }
//       });
//     }
//     else if (result.Status == RESULT_ERROR){
//       console.log("Error Processing Email");
//     }
//   });
// };

// module.exports = MailListener;
/*// Module exports 
exports.createListener = function(configuration) {
  mailListener = new MailListener(configuration);
};

exports.start = function(){
  mailListener.start(); // start listening
}; 

exports.onMailReceived = function(whatToDo){
  mailListener.on("mail", function(mail, seqno, attributes){
    var result = whatToDo(sender, receiver, subject, content);
    if (result.Status == RESULT_SUCCESS){
      console.log("Email succesfully processed", mail);
      // Mark email as Seen
      mailListener.imap.addFlags(mail.uid, '\\Seen', function(err) {
        if(!err) {
          console.log('mail marked as read');
        }
      });
    }
    else if (result.Status == RESULT_ERROR){
      console.log("Error Processing Email");
    }
  });
};

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});


mailListener.on("attachment", function(attachment){
  console.log(attachment.path);
});

// it's possible to access imap object from node-imap library for performing additional actions. E.x.
//mailListener.imap.move(:msguids, :mailboxes, function(){})*/