const db = require('./db/database');
const bookDB = require('./db/bookDatabase');

class LoanRecord {
    static maxLoanDays = 30;

    readerId;
    bookId;
    loanDate;
    returnDate;

    constructor(dbStr) {
        const data = db.Database.parseDBStr(dbStr);

        this.bookId = data[1];
        this.readerId = data[2];
        this.loanDate = data[3];
        this.returnDate = LoanRecord.isDateUndefined(data[4]) ? '-' : data[4];
    }

    static isDateUndefined(str) {
        return str === 'xx.xx.xx';
    }

    book() {
        return bookDB.db.getBookById(this.bookId);
    }

    isArchived() {
        return this.loanDate !== '-';
    }

    isOverdue() {
        if (this.returnDate !== '-') return false;

        const ld = new SDate(this.loanDate);

        const today = new Date();
        const loanedOn = new Date(ld.getYear(), ld.getMonth(), ld.getDay());
        const daysFromLoan = (today - loanedOn) / (1000 * 60 * 60 * 24);
console.log(daysFromLoan);
        return daysFromLoan > LoanRecord.maxLoanDays || daysFromLoan < 0;
    }

    status() {
        if (this.returnDate === '-') {
            return this.isOverdue() ? 'overdue' : 'open';
        }

        return 'archived';
    }
}

class SDate {
    str; // dd.mm.yy

    constructor(str) {
        this.str = str;
    }

    getYear() {
        return '20' + this.str.substr(6, 2);
    }

    getDay() {
        return Number(this.str.substr(0, 2)) + 1;
    }

    getMonth() {
        return Number(this.str.substr(3, 2)) - 1;
    }
}

module.exports = LoanRecord;