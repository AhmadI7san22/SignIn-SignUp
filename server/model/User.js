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

// Define the model only once
const UserModel = mongoose.model("User", UserSchema);  // 'User' is the model name

// Export the model
module.exports = UserModel;
