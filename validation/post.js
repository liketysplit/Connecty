const validator = require("validator");
const _ = require("lodash");


// this validation works for both Post and Comment because in both models, the only required feild is text.
module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = _.isEmpty(data.text) ? "" : data.text;

    if (validator.isEmpty(data.text)) {
        errors.text = "Text is required";
    } else if (!validator.isLength(data.text, {
            min: 10,
            max: 300
        })) {
        errors.text = "Text needs to be between 10 and 300 characters";
    }

    // other required fields including user, name, and avatar will
    // be filled up programmatically.

    return {
        errors,
        isValid: _.isEmpty(errors)
    };
};