const db = require('./database');

class UserDatabase extends db.Database {
    constructor(fileName) {
        super(fileName);
    }

    static instantiate(str){

    }

    getUserByUsername(username) {
        return this.getRecordByNthDataCell(2, username, true);
    }

    getUserStrById(id) {
        return this.getRecordByNthDataCell(1, id, true);
    }

    getUserStatusById(id){
        return db.Database.parseDBStr(this.getUserStrById(id))[3];
    }
}

module.exports = new UserDatabase('user.txt');