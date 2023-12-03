const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Activity', ActivitySchema, 'activities');
