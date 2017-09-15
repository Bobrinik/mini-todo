import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

mongoose.connect('mongodb://localhost/Todo');

var userSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String
});

userSchema.methods.isPasswordCorrect = function (attemptPassword, callback, id) {
    let storedHash = this.password;
    bcrypt.compare(attemptPassword, storedHash, function (err, res) {
        if (err) {
            callback(err);
        }
        callback(null, res, id);
    });
};

module.exports = mongoose.model('User', userSchema);