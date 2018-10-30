const validator = require("validator");
const _ = require("lodash");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // in case the req does not include the name field at all, we just assign an empty string to req.name
    // because helper functions in the validator module can only handle strings
    data.name = _.isEmpty(data.name) ? "" : data.name;

    // do the same for the other fileds
    data.email = _.isEmpty(data.email) ? "" : data.email;
    data.password = _.isEmpty(data.password) ? "" : data.password;
    data.password2 = _.isEmpty(data.password2) ? "" : data.password2;

    if (validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    } else if (!validator.isLength(data.name, {
            min: 2,
            max: 30
        })) {
        errors.name = "Name must be between 2 and 30 characters";
    }

    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    } else if (!validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.password = "Password must be at least 6 characters";
    }

    if (validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    } else if (!validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    return {
        errors,
        isValid: _.isEmpty(errors)
    };
};