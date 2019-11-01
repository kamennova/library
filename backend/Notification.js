class Notification {
    code = 1; // 0 or 1
    message;

    constructor(type, msg) {
        this.code = type;
        this.message = msg;
    }

    getType() {
        if (this.code === 0) return 'negative';

        return 'positive';
    }
}

module.exports = Notification;