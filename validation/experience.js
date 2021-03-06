const validator = require("validator");
const _ = require("lodash");

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = _.isEmpty(data.title) ? "" : data.title;
    data.company = _.isEmpty(data.company) ? "" : data.company;
    data.from = _.isEmpty(data.from) ? "" : data.from;

    if (validator.isEmpty(data.title)) {
        errors.title = "Job title field is required";
    }

    if (validator.isEmpty(data.company)) {
        errors.company = "Company field is required";
    }

    if (validator.isEmpty(data.from)) {
        errors.from = "From date field is required";
    }

    return {
        errors,
        isValid: _.isEmpty(errors)
    };
};