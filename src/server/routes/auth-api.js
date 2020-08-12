/*
    This file is heavily inspired from
    https://github.com/arcuri82/web_development_and_api_design/blob/master/les08/authentication/src/server/routes.js
 */
const express = require("express");
const passport = require("passport");
const router = express.Router();

const Users = require("../db/users");

router.post("/login", passport.authenticate("local"), (req, res) => {

    res.status(204).send();
});


router.post('/signup', function (req, res) {

    const created = Users.createUser(req.body.userId, req.body.password);

    if (!created) {
        res.status(400).send();
        return;
    }

    passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
            if (err) {
                //shouldn't really happen
                res.status(500).send();
            } else {
                res.status(201).send();
            }
        });
    });
});

router.post("/logout", function (req, res) {

    req.logout();
    res.status(204).send();
});

/**
 * endpoint to retrieve the current info on the logged-in user: userId, x, y, etc
 * NOTE: you must NOT return the password in the user-info endpoint...
 */
router.get("/user", (req, res) => {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    if (req.user) {
        res.status(200).json({
            id: req.user.id,
            // x
            // y
        });
    }
});

// another endpoint for the project

module.exports = router;
