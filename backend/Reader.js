const User = require('./User');
const LoanRecordsDB = require('./db/LoanRecordDatabase');
const OverdueNotification = require('./OverdueNotification');

class Reader extends User {
    constructor(readerStr) {
        super(readerStr);
    }

    getLoanRecords() {
        return LoanRecordsDB.db.getRecordsByReaderUsername(this.username);
    }

    getNotifications() {
        return this.getOverdueNotifications().concat(this.getQueueNotifications());
    }

    getQueueNotifications() {
        return [];
    }

    getOverdueNotifications() {
        const overdueLoans = this.getLoanRecords().filter(record => record.isOverdue());

        return overdueLoans.map(record => new OverdueNotification(record.book().title));
    }
}

module.exports = Reader;