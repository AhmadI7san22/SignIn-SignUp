const mongoose = require('mongoose');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Compare passwords method
UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;


const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
