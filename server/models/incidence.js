'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IncidenceSchema = new Schema({
  title: {
    type: String,
    index: true,
    required: true
  },
  description: {
    type: String,
    default: '',
    trim: true
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
    // Possble statuses : Open, On going, Closed, Reopened
    type: String,
    default: 'Open'
  },  
  substatus: { 
    // Possble substatuses : Open-OnGoing, Open-Blocked,
    // Closed-Solved, Closed-Duplicated, Closed-Invalid
    type: String,
    default: ''
  },  
  assigned: String, //Username currently working on it
  history: {
    type: [{
      post: String,
      author: {
        type: Schema.ObjectId,
        ref: 'User'
      },
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
    default: -1
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
      _id: id
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