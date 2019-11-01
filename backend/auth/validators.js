const userDB = require('../db/userDatabase');

module.exports.validateUsername = (username) => {
    if (userExists(username)) {
        throw new Error('User already exists!');
    }

    validateGroupName(username);
};

const userExists = (username) => {
    return userDB.getUserByUsername(username);
};

const validateGroupName = (username) => {
    if (username.length !== 6) {
        throw new Error('Group name should be 6 symbols long');
    }

    if (!isAlpha(username[0]) || !isAlpha(username[1])) {
        throw new Error('First 2 symbols in group name should be letters');
    }

    if (!isNumber(username.substr(2))) {
        throw new Error('Last 4 symbols in group name should be numbers')
    }

    return true;
};

const isAlpha = (char) => {
    return char.match(/[a-z]/i);
};

const isNumber = (str) => {
    return !isNaN(str);
};

module.exports.validatePassword = (password, confirm) => {
    if (password !== confirm) {
        throw new Error('You entered different passwords!');
    }
};