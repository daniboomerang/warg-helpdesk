var config = require('./config');

var RESULT_SUCCESS = "SUCCESS";
var RESULT_WARNING = "WARNING";
var RESULT_ERROR = "ERROR";

var MailListener = require('mail-listener2');

var _mailListener;
var _processIncoming;

module.exports = function(configuration){

  _mailListener = new MailListener(configuration);

  return {
    start: _start,
    onMailReceived: _onMailReceived
  }
};

var _start = function(){
  _mailListener.start();
};

var _onMailReceived = function(processIncoming){
  _processIncoming = processIncoming;

  _mailListener.on("mail", function(mail, seqno, attributes){
    var mailData = {
      _mail: mail,
      _attributes: attributes
    };

    var from = mail.from[0].address;
    var to = mail.to[0].address;
    var subject = mail.subject;
    var content = mail.text;

    var incomingProcessSuccess = incomingProcessSuccessBinder.bind(mailData);
    var incomingProcessError = incomingProcessErrorBinder.bind(mailData);

    _processIncoming(from, to, subject, content)
      .then(incomingProcessSuccess, incomingProcessError);
  });
};

var incomingProcessSuccessBinder = function (processResult){
  if (processResult.status == RESULT_WARNING){
    console.log('Email: ', this._mail.subject, 'processed with errors.');
  } else {
    console.log('Email: ', this._mail.subject, 'processed without errors.');
  }
  _markEmailAsSeen(this._attributes.uid);
};

var incomingProcessErrorBinder = function(error){
  console.log('Email: ', this._mail.subject, 'Not processed.');
};

var _markEmailAsSeen = function(mailId){
  _mailListener.imap.addFlags(mailId, '\\Seen', function(err) {
    if(!err) {
      console.log('mail marked as read');
    }
  });
};
