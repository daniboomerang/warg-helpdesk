'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  text: {
    type: String,
    index: true,
    required: true
  },
  addressee: {
    type: Schema.ObjectId,
    ref: 'User',
	  required: true
  },
  created: {
  	type: Date
  },	
  status: {
    // Possible statuses : Unseen, Seen
    type: String,
    default: 'New'
  },
  incidenceId: {
    type: String
  }
});

/**
 * Pre hook.
 */

NotificationSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();
  next();
});

/**
 * Statics
 */
NotificationSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('addressee','username').exec(cb);
  }
};

/**
 * Plugins
 */

function slugGenerator (options){
  options = options || {};
  var key = options.key || 'text';

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
      return v;
    });
  };
};

NotificationSchema.plugin(slugGenerator());

/**
 * Define model.
 */

mongoose.model('Notification', NotificationSchema);