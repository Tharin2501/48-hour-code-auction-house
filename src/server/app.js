/* heavily inspired by: https://github.com/arcuri82/web_development_and_api_design/blob/master/les09/chat/websocket-rest/src/server/app.js
 */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const matchApi = require('./routes/item-api');
const authApi = require("./routes/auth-api");
const Users = require("./db/users");

const app = express();

//to handle JSON payloads
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));


app.use(session({
    secret: "A secret used to encrypt the session cookie",
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(
    {
        usernameField: "userId",
        passwordField: "password"
    },
    function (userId, password, done) {

        const ok = Users.verifyUser(userId, password);

        if (!ok) {
            return done(null, false, {message: "Invalid username/password"});
        }

        const user = Users.getUser(userId);
        return done(null, user);
    }
));

passport.serializeUser(function (user, done) {
   done(null, user.id)
});

passport.deserializeUser(function (id, done) {

    const user = Users.getUser(id);

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authApi);
app.use('/api', matchApi);

app.use(express.static('public'));

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = {app};
