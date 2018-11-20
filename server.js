const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
const posts = require("./routes/api/posts");
const passport = require("passport");
const path = require("path");

const app = express();

// Body parser middeware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// app.get("/", (req, res) => res.send("hello!"));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Use routes
app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/posts", posts);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

// The actual port for the app in prodcution will come from the env. var. "PORT". For local dev., we just use 5000.
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));