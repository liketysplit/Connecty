const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    // an alias that can be used to view the profile without the need to login
    handle: {
        type: String,
        required: true,
        max: 40
    },

    company: {
        type: String
    },

    website: {
        type: String
    },

    website: {
        type: String
    },

    location: {
        type: String
    },

    // selected from a list including junior developer, senior developer, student, instructor,...
    status: {
        type: String,
        required: true
    },

    skills: {
        type: [String], // an array
        required: true
    },

    bio: {
        type: String
    },

    // in the frontend, we will use this field to display user's github repositories
    githubusername: {
        type: String
    },

    // an array of objects
    experience: [{
        title: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        location: {
            type: String
        },
        from: {
            type: Date,
            required: true
        },
        to: {
            // not required because it can be "now"
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String
        }
    }],
    // an array of objects
    education: [{
        school: {
            type: String,
            required: true
        },
        degree: {
            type: String,
            required: true
        },
        fieldofstudy: {
            type: String,
            required: true
        },
        from: {
            type: Date,
            required: true
        },
        to: {
            // not required because it can be "now"
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String
        }
    }],
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// "profiles" is the name of a (JSON) collection in MongoDB, which is analogous to a table in a relational database.
// "Profile" is a Mongoose object that represents it.
module.exports = Profile = mongoose.model("profiles", ProfileSchema);