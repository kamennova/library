const fs = require('fs');
const readline = require('readline');
const readLastLine = require('read-last-line');

class Database {
    static separator = '|';

    fileName;

    constructor(fileName) {
        this.fileName = fileName;
    }

    static toDBStr(dataArr) {
        let str = '';

        for (const elem of dataArr) {
            str += elem + Database.separator;
        }

        return str.substr(0, str.length - 1);
    }

    static isStrValid(str) {
        return str[0] !== 'x';
    }

    static parseDBStr(str) {
        return str.split(Database.separator);
    }

    static getNthDataCell(str, n) {
        let num = 0;
        let cell = '';

        for (let i = 0, len = str.length; i < len; i++) {
            if (str[i] !== Database.separator) {
                cell += str[i];
            } else {
                num++;

                if (num === n) {
                    break;
                }

                cell = '';
            }
        }

        if (num < n - 1) {
            throw new Error('No more data in string ' + str);
        }

        if (cell === '') {
            throw new Error('No data');
        }

        return cell;
    }

    static isStrLike(str, like) {
        return (like.toLowerCase().includes(str.toLowerCase()));
    }

    static getIdByDBString(str) {
        return Database.getNthDataCell(str, 1);
    }

    fullDBPath() {
        return __dirname + '/' + this.fileName;
    }

    async getLastId() {
        const lastStr = await this.getLastStr();
        // console.log('last str: ' + lastStr);

        if (lastStr === '') {
            console.log('first record');
            return 0;
        }

        return Database.getNthDataCell(lastStr, 1);
    }

    getLastStr() {
        return readLastLine.read(__dirname + '/' + this.fileName, 1);
    }

    writeStr(str) {
        fs.appendFile(__dirname + '/' + this.fileName, "\n" + str, (err) => {
            if (err) throw err;

            console.log('String appended');
        });
    }

    getRecordPos(id) {
        let pos = 0;

        fs.readFileSync(this.fullDBPath()).toString().split('\n').forEach((line) => {
            if (!Database.isStrValid(line)) {
                return;
            }

            const cellId = Database.getNthDataCell(line, 1);

            if (cellId === id.toString()) {
                return pos;
            }

            pos += line.length;
        });

        return pos;
    }

    eraseRecord = async (id) => {
        const pos = this.getRecordPos(id);

        fs.open(this.fullDBPath(), 'r+', function (err, fd) {
            if (err) {
                throw 'could not open file: ' + err;
            }

            fs.write(fd, 'x', pos, 'utf8', function (err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function () {
                    console.log('wrote the file successfully');
                });
            });
        });
    };

    editRecordNthDataCell = async (id, index, newData) => {
        let str = this.getRecordById(id);
        let data = Database.parseDBStr(str);
        data[index] = newData;

        const newStr = data.join(Database.separator);

        await this.eraseRecord(id);
        this.writeStr(newStr);
    };

    getRecordByNthDataCell(n, data, isStrict = false) {
        let userStr = false;

        fs.readFileSync(this.fullDBPath()).toString().split('\n').forEach((line) => {
            if (!Database.isStrValid(line)) return;

            const cell = Database.getNthDataCell(line, n);

            if ((isStrict && (data === cell)) || (!isStrict && Database.isStrLike(data, cell))) {
                userStr = line;
            }
        });

        return userStr;
    }

    getRecordsByNthDataCell(n, data, isStrict = false) {
        let records = [];

        fs.readFileSync(this.fullDBPath()).toString().split('\n').forEach((line) => {
            if (!Database.isStrValid(line)) return;

            const cell = Database.getNthDataCell(line, n);

            if ((isStrict && data === cell) || (!isStrict && Database.isStrLike(data, cell))) {
                records.push(line);
            }
        });

        return records;
    };

    getRecordById(id) {
        return this.getRecordByNthDataCell(1, id.toString(), true);
    }
}

module.exports = {
    Database: Database
};