const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            // console.log(jwt_payload);
            // return done(null, true);
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user); // call the done function with two arguments: null for no error, and the user found
                    }
                    return done(null, false); // call the done function with two arguments: null for no error, and false for user not found
                })
                .catch(err => console.log(err));
        })
    );
};