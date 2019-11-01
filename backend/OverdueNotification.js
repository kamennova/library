const Notification = require('./Notification');

class OverdueNotification extends Notification {
    constructor(bookTitle) {
        const message = "Your loan for the book \"" + bookTitle + "\" is overdue. Please return the book ASAP";

        super(0, message);
    }
}

module.exports = OverdueNotification;