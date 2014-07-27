var config = require('./config.dev');
 
config.env = 'production';
config.mongo.db = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
 
// Mailing
// Mail-Sender => Sendgrid
config.mailSending = {
  sendgrid_username: process.env.SENDGRID_USERNAME,
  sendgrid_password: process.env.SENDGRID_PASSWORD,
  support_Helpdesk:  process.env.SUPPORT_HELPDESK,
  noreply_Helpdesk:  process.env.NOREPLY_HELPDESK
};

// Mail-Listener
config.mailListening = {
  username: process.env.GMAIL_USERNAME,
  password: process.env.GMAIL_PASSWORD,
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

module.exports = config;