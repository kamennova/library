const db = require('./db/database');

class Book {
    title;
    authorName;
    publishingHouse;
    edition;

    currentReaderId;
    reservatorId;
    queueId;

    constructor(str) {
        const data = db.Database.parseDBStr(str);

        this.title = data[1];
        this.authorName = data[2];
        this.publishingHouse = data[3];
        this.edition = data[4];

        this.currentReaderId = data[5];
        this.reservatorId = data[7];
    }

    status() {
        return Number(this.reservatorId) === 0 && Number(this.currentReaderId) === 0;
    }
}

module.exports = Book;