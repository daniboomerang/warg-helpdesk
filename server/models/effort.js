'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Types
var USER_EFFORTS = 'User';
var INCIDENCE_EFFORTS = 'Incidence';

var EffortSchema = new Schema({
  type: String, // Who´s the report (USER_EFFORT or INCIDENCE_EFFORT)
  owner: String,
  data:  {
    type: [{
      reporter: String, // Who reports (userId or incidenceId)
      effort: Number  
    }],
    default: [],
    trim: true
  }  
});

/**
 * Pre hook.
 */

EffortSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();
  next();
});

/**
 * Define model.
 */

mongoose.model('Effort', EffortSchema);