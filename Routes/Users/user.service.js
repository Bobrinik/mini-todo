import bcrypt from "bcryptjs";
import User from "./user.model";

// We need to make sure that by this point userData is sterile
function storePassword(userData, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(userData.password, salt, function (err, hash) {
            let myUser = new User({ name: userData.name, password: hash, email: userData.email });
            console.log(userData);
            myUser.save((err) => {
                if (err) {
                    callback(err);
                }
                callback();
            });
        });
    });
}

// We need to make sure that by this point userData is sterile
function verifyPassword(userData, callback) {   
    User.findOne({ email: userData.email }, (err, user) => {
        if (err) {
            callback(err);
        }
        else if(!user){
            callback("User is not found");
        }
        else {
            user.isPasswordCorrect(userData.password, callback, user.id); // FIXME: It's an ugly way to pass id
        }
    });
}

function getUser(userId, callback) {
    User.findById(userId, (err, user) => {
        if (err) {
            callback(err);
        }
        else {
            callback(null, user);
        }
    });
}

export { storePassword, verifyPassword, getUser }