'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SchoolSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  created: {
  	type: Date
  }
});

/**
 * Pre hook.
 */

SchoolSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();
  next();
});

/**
 * Define model.
 */

mongoose.model('School', SchoolSchema);