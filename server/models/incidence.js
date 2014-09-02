'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IncidenceSchema = new Schema({
  id: {
    type: String, //School code - number: Example: MIL-12343
    required: true
  },
  title: {
    type: String,
    index: true,
    required: true
  },
  description: {
    type: String
  },
  severity: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  created: Date,
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  updated: [Date],
  status: {
    type: {
      // Possible statuses : Open, Closed, Reopened
      currentStatus: String,
      // Possible substatuses : Open-OnGoing, Open-Blocked,
      // Closed-Solved, Closed-Duplicated, Closed-Invalid
      currentSubstatus: String,
      duplicatedOf: {
        type: Schema.IncidenceId,
        ref: 'User'
      },
      blockedBy: {
        type: Schema.IncidenceId,
        ref: 'User'
      }
    }
  },  
  assigned: String, //UserId of the technician in charge
  history: {
    type: [{
      post: String,
      author: String,
      date: Date  
    }],
    default: [],
    trim: true
  }, 
  rate: {
    type: Number,
    default: -1
  }, 
  effort: {
    //number of minutes
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  }
});

/**
 * Pre hook.
 */

IncidenceSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();

  this.updated.push(Date.now());
  next();
});

/**
 * Statics
 */
IncidenceSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      id: id
    }).populate('creator', 'username').exec(cb);
  }
};

/**
 * Methods
 */

IncidenceSchema.statics.findByTitle = function (title, callback) {
  return this.find({ title: title }, callback);
}

IncidenceSchema.methods.expressiveQuery = function (creator, date, callback) {
  return this.find('creator', creator).where('date').gte(date).run(callback);
}

/**
 * Plugins
 */

function slugGenerator (options){
  options = options || {};
  var key = options.key || 'title';

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
      return v;
    });
  };
};

IncidenceSchema.plugin(slugGenerator());

/**
 * Define model.
 */

mongoose.model('Incidence', IncidenceSchema);