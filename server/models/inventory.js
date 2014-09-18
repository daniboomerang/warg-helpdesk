'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var InventorySchema = new Schema({
  internalId: {
    type: String
  },
  serial: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String
  },
  model: {
    type: String
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  acquisitionDate: {
    type: Date
  },
  guaranteeExpirationDate: {
    type: Date
  },
  lastInventoryDate: {
    type: Date
  },
  disabled: {
    type: Object
  },
  schoolId: {
    type: String,
    required: true
  }
});

/**
 * Pre hook.
 */

InventorySchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();
  next();
});

/**
 * Define model.
 */

mongoose.model('Inventory', InventorySchema);