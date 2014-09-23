var config = require('./config');

var RESULT_SUCCESS = "SUCCESS";
var RESULT_WARNING = "WARNING";
var RESULT_ERROR = "ERROR";

var MailListener = require('mail-listener2');

module.exports = function(configuration){

  var mailListener = new MailListener(configuration);
  var _processIncoming;

  var _onMailReceived = function(processIncoming){
    _processIncoming = processIncoming;

    mailListener.on("mail", function(mail, seqno, attributes){
      var mailData = {
        _mail: mail,
        _attributes: attributes
      };

      var from = mail.from[0].address;
      var to = mail.to[0].address;
      var subject = mail.subject;
      var content = mail.text;

      _processIncoming(from, to, subject, content)
        .then(incomingProcessSuccess.bind(mailData), incomingProcessError.bind(mailData));
    });
  };

  var incomingProcessSuccess = function (processResult){
    console.log("############ A LA VUELTA EN MAIL LISTENER");
    console.log(processResult);
    if (processResult.status == RESULT_WARNING){
      console.log('Email: ', this._mail.subject, 'processed with errors.');
    } else {
      console.log('Email: ', this._mail.subject, 'processed without errors.');
    }
    _markEmailAsSeen(this._attributes.uid);
  };

  var incomingProcessError = function(error){
    console.log('Email: ', this._mail.subject, 'Not processed.');
  };

  var _markEmailAsSeen = function(mailId){
    console.log("############## mark email as seen");
    mailListener.imap.addFlags(mailId, '\\Seen', function(err) {
      if(!err) {
        console.log('mail marked as read');
      }else{
        console.log('mail not marked as seenn');
      }
    });
  };

  return {
    start: mailListener.start(),
    onMailReceived: _onMailReceived
  }
};