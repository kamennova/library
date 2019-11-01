const db = require('./database');
const userDB = require('./userDatabase');
const LoanRecord = require('../LoanRecord');

class LoanRecordDatabase extends db.Database {
    id;

    constructor(fileName) {
        super(fileName);
    }

    static instantiate(arr) {
        return arr.map(item => new LoanRecord(item));
    }

    getRecordsByReaderUsername(username) {
        const userStr = userDB.getUserByUsername(username);

        if (!userStr) {
            throw new Error('User with such username doesn`t exist');
        }

        const userId = db.Database.getIdByDBString(userStr);

        return LoanRecordDatabase.instantiate(this.getRecordStringsByReaderId(userId));
    }

    getRecordStringsByReaderId(id) {
        return this.getRecordsByNthDataCell(3, id, true);
    }

    getRecordsByReaderId(id) {
        return this.getRecordsByNthDataCell(3, id, true);
    }
}

module.exports = {
    db: new LoanRecordDatabase('./files/loanRecords.txt'),
    class: LoanRecordDatabase
};