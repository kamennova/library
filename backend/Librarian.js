const User = require('./User');

class Librarian extends User {
    constructor(userStr) {
        super(userStr);

        this.status = 2;
    }
}

module.exports = Librarian;