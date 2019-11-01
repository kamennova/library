const User = require('./User');

class Admin extends User {
    constructor(userStr) {
        super(userStr);

        this.status = 3;
    }
}

module.exports = Admin;