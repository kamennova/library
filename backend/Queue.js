const db = require("./database");
const bookDB = require('./db/bookDatabase');

class Queue {
    bookId;
    readers;

    constructor(str) {
        const data = db.Database.parseDBStr(str);

        this.bookId = data[1];
        this.readers = data[2].split(',');
    }

    book() {
        return bookDB.db.getBookById(this.bookId);
    }
}

module.exports = Queue;