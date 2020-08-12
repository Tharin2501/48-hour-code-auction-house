/*
    This file is heavily inspired from
    https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-08/src/server/db/users.js
 */
const users = new Map();

function getUser(id) {

    return users.get(id)
}

function verifyUser(id, password) {

    const user = getUser(id);

    if (!user) {
        return false;
    }
    return user.password === password;
}

function createUser(id, password) {

    if (getUser(id)) {
        return false;
    }

    const user = {
        id: id,
        password: password
    };
    users.set(id, user);
    return true;
}

function resetAllUsers() {
    users.clear();
}

module.exports = {getUser, verifyUser, createUser, resetAllUsers};
