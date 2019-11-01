const db = require('../db/database');
const userDB = require('../db/userDatabase');
const User = require('../User');

module.exports = async (req) => {
    // console.log('username: ' + req.username);
    const userStr = userDB.getUserByUsername(req.username);
    // console.log('userStr: ' + userStr);

    if (!userStr) {
        throw new Error('User not found');
    }

    const user = new User(userStr);
    // console.log(user);

    if (!user.verifyPassword(req.password)) {
        throw new Error("Invalid password");
    }

    // console.log('Logging in');

    return {
        userId: db.Database.getIdByDBString(userStr),
        userStr: userStr
    };
};