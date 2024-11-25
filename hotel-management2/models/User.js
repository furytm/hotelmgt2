// models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user'],
  },
});

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  const payload = {
    userId: this._id,
    email: this.email,
    roles: this.roles,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
