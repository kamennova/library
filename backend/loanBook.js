const bookDB = require('./db/bookDatabase');

const userDB = require('./db/userDatabase');
const User = require('./User');

module.exports = (ctx, res) => {
    const book = bookDB.db.getBookById(res.bookId);

    if (!book) {
        throw new Error('Book not found');
    }

    if (!book.status()) {
        throw new Error('Book not available!');
    }

    const readerStr = userDB.getUserByUsername(res.username);

    if (!readerStr) {
        throw new Error('Reader not found');
    }

    const user = new User(readerStr);

    if (!user.isReader()) {
        throw new Error('User is not a reader!');
    }

    console.log('Book is loaned to ' + res.username);

    return ctx.redirect('/librarian');
};