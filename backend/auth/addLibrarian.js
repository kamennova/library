const validator = require("./validators");
const db = require("../db/database");
const userDB = require('../db/userDatabase');

module.exports = async (req) => {
    validator.validateUsername(req.username);

    return await createNewLibrarian(req.username, req.pass);
};

const createNewLibrarian = async (username, pass) => {
    console.log('creating librarian: ' + username + pass);

    const lastUserId = Number(await userDB.getLastId());
    const userId = lastUserId + 1;

    const str = db.Database.toDBStr([userId.toString(), username, pass, 2]);

    userDB.writeStr(str);

    return {
        groupNo: username
    }
};