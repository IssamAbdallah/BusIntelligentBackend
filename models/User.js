const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
     type: String, 
     required: true },
  myadmin: {
     type: String, 
     required: true },

  email: { 
    type: String, required: true, 
    unique: true },
  password: { 
    type: String, 
    required: true },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'consultant'],
    default: 'consultant'
  },
  agencies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency'
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
