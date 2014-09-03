var config = module.exports = {};

config.env = 'dev';
 
//mongo database
config.mongo = {};
config.mongo.db = 'mongodb://localhost/warg_helpdesk_dev';

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
  username: process.env.LOCAL_MAIL_USERNAME,
  password: process.env.LOCAL_MAIL_PASSWORD,
  host: process.env.LOCAL_MAIL_HOST,
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