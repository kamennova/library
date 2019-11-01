const db = require("./database");
const Queue = require('../Queue');

class QueueDatabase extends db.Database {
    constructor(fileName) {
        super(fileName);
    }

    static instantiate(str) {
        return new Queue(str);
    }

    getQueueById(id) {
        return this.getRecordById(id);
    }
}