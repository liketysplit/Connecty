const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true // email is used as user name
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// "users" is the name of a (JSON) collection in MongoDB, which, if you wish, is analogous to a table in the relational database.
// "User" is a Mongoose object that represents it.
module.exports = User = mongoose.model("users", UserSchema);