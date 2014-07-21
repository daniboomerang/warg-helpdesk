var config = module.exports = {};
 
config.env = 'dev';
 
//mongo database
config.mongo = {};
config.mongo.db = 'mongodb://localhost/warg_helpdesk_dev';

// Mail-Listener
config.mailing = {
  username: "estevez.dani@gmail.com",
  password: "win2000d",
  host: "imap.gmail.com",
  port: 993, // imap port
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: false, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: {streamAttachments: false},   // options to be passed to mailParser lib.
  attachments: false, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
};