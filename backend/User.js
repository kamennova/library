const db = require('./db/database');

class User {
    username;
    password;
    status;

    constructor(userStr) {
        const data = db.Database.parseDBStr(userStr);

        this.username = data[1];
        this.password = data[2];
        this.status = Number(data[3]);
    }

    verifyPassword(password) {
        return password === this.password;
    }

    isReader(){
        return this.status === 1;
    }

    isLibrarian() {
        return this.status === 2;
    }

    isAdmin() {
        return this.status === 3;
    }
}

module.exports = User;