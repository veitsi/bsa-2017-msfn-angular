const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcrypt-nodejs');
const activateService = require('../services/activateService');


const User = new Schema({
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isCoach: Boolean,
    isAdmin: Boolean,
    requestForCoaching: Boolean,
    position: Number,
    salt: {
        type: String,
    },
    googleID: String,
    facebookID: String,
    twitterID: String,
    follow: [ObjectId],
    userPhoto: String,
    gender: String,
    birthday: String,
    height: Number,
    weight: Number,
    activateToken: String
});

User.pre('save', function(next) {
    const userData = this;

    // Create activateToken token for user and be able to send it to email and confirm email after
    userData.activateToken = activateService.makeid();

    if (!userData.isModified('password')) return next();

    bcrypt.genSalt(1012, (err, salt) => {
        userData.salt = salt;
        this.encryptPassword(this.password, (err, hash) => {
            "use strict";
            if (err) return next(err);

            userData.password = hash;
            next();
        })
    });
});

User.post('save', function(user) {
    activateService.sendRegistrationLetter(user);
});

User.pre('update', function(next) {
  const fields = this._update.$set;

  if (!fields.password) return next();

  bcrypt.genSalt(1012, (err, salt) => {
    fields.salt = salt;
    bcrypt.hash(fields.password, fields.salt, null, (err, hash) => {
      if (err) return next(err);

      fields.password = hash;
      next();
    });
  });
});

User.methods.checkPassword = function(password, callback){
    "use strict";
    this.encryptPassword(password, (err, hash) => {
        if (err) return callback(err);
        callback(err, (hash === this.password))
    });
};

User.methods.encryptPassword = function(password, callback){
    "use strict";
    bcrypt.hash(password, this.salt, null, (err, hash) => {
        callback(err, hash);
    });
};

User.methods.checkToken = function(token, callback){
    callback(this.activateToken === token);
}

module.exports = mongoose.model('User', User);
