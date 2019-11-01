const validator = require("./validators");
const db = require("../db/database");
const userDB = require('../db/userDatabase');

module.exports = {
    signUp: async (req) => {
        validator.validateUsername(req.username);
        validator.validatePassword(req.password, req.confirmPassword);

        return await createNewReader(req.username, req.password);
    }
};

const createNewReader = async (username, pass) => {
    console.log('creating reader: ' + username + pass);

    const lastUserId = Number(await userDB.getLastId());
    const userId = lastUserId + 1;

    const str = db.Database.toDBStr([userId.toString(), username, pass, 1]);

    userDB.writeStr(str);

    return {
        groupNo: username
    }
};