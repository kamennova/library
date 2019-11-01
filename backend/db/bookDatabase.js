const db = require("./database");
const Book = require("../book");

class BookDatabase extends db.Database {
    format = ['id', 'title', 'author', 'publishingHouse', 'year'];

    constructor(fileName) {
        super(fileName);
    }

    static instantiate(str) {
        return new Book(str);
    }

    getSomeBooks() {
        return this.getBooksByTitle('a').map(bookStr => new Book(bookStr));
    }

    getBooksByTitle(titleLike) {
        return this.getRecordsByNthDataCell(2, titleLike);
    }

    getBooksByAuthor(authorLike) {
        return this.getRecordsByNthDataCell(3, authorLike);
    }

    getBookById(id) {
        return BookDatabase.instantiate(this.getRecordByNthDataCell(1, id, true));
    }

    getBook = async (req) => {
        // console.log("Searching for book: " + req.bookTitle + " by " + req.authorName);

        let titleRes = [],
            authorRes = [];

        if (req.bookTitle !== '') {
            titleRes = this.getBooksByTitle(req.bookTitle);
        }

        // console.log("Results by title: ");
        // console.log(titleRes);

        if (req.authorName !== '') {
            authorRes = this.getBooksByAuthor(req.authorName);
        }

        // console.log("Results by author: ");
        // console.log(authorRes);

        let results = [];

        if (req.authorName !== '' && req.bookTitle !== '') {
            results = authorRes.filter(item => titleRes.indexOf(item) >= 0);
        } else if (req.bookTitle !== '') {
            results = titleRes;
        } else if (req.authorName !== '') {
            results = authorRes;
        }

        // console.log("Results: ");
        // console.log(results);

        let books = results.map(res => new Book(res));

        return {books: books};
    };

    addBook = async (title, author, edition, ph) => {
        console.log('creating book');

        const lastId = Number(await this.getLastId());
        const bookId = lastId + 1;

        const str = db.Database.toDBStr([bookId.toString(), title, author, ph, edition, 0, 0, 0]);

        this.writeStr(str);
    }
}

module.exports.BookDatabase = BookDatabase;

module.exports.db = new BookDatabase('book.txt');