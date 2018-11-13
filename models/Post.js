const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    text: {
        type: String,
        required: true
    },

    // The rationale for each post to have a (user) name and avatar is
    // we want to keep all the posts even after the user who created them have
    // deleted his account because those posts (and comments) may be still valuable
    // and helpful to others.
    // These two fields will be filled programmatically rather than by the post creator manually.
    name: {
        type: String
    },

    avatar: {
        type: String
    },

    // Each user can only like a post once. As soon as he does so, his id will be added to
    // the "likes" array. His id will be removed from the array as soon as he dislikes the post.
    likes: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "users"
        }
    }],

    // The structure of comments is the same as posts.
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],

    date: {
        type: Date,
        default: Date.now
    }
});

// "posts" is the name of a (JSON) collection in MongoDB, which is analogous to a table in the relational database.
// "Post" is a Mongoose object that represents it.
module.exports = Post = mongoose.model("posts", PostSchema);