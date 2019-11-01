const Router = require('koa-router');
const router = new Router();
const signUp = require("./auth/signUp");
const addLibrarian = require('./auth/addLibrarian');
const book = require('./book');
const bookDB = require('./db/bookDatabase');
const logIn = require('./auth/logIn');
const Reader = require('./Reader');
const userDB = require('./db/userDatabase');
const User = require('./User');
const Librarian = require('./Librarian');
const Admin = require('./Admin');
const loanBook = require('./loanBook');

router.get('/', async ctx => await ctx.render('index', {
    books: bookDB.db.getSomeBooks(),
    userId: ctx.cookies.get('userId')
}));
router.post('/', async (ctx) => await bookDB.db.getBook(ctx.request.body)
    .then((res) => ctx.render('index', {books: res.books, userId: ctx.cookies.get('userId')}))
);

router.get('/signup', async (ctx) => await ctx.render('signup'));
router.post('/signup', (ctx) => signUp.signUp(ctx.request.body)
    .then(async (res) => await ctx.redirect('login', {justSignedUp: true, groupNo: res.groupNo}))
    .catch((err) => ctx.render('signup', {err: err}))
);

router.get('/login', async (ctx) => await ctx.render('login', {justSignedUp: false}));
router.post('/login', async (ctx) => await logIn(ctx.request.body)
    .then(async (res) => {
        ctx.cookies.set('userId', res.userId);

        const user = new User(userDB.getUserStrById(res.userId));

        if (user.isLibrarian()) {
            await ctx.redirect('librarian');
        } else if (user.isAdmin()) {
            await ctx.redirect('admin');
        } else {
            await ctx.redirect('profile');
        }
    })
    .catch((err) => ctx.render('login', {err: err}))
);

router.get('/profile', async (ctx) => {
        const userId = ctx.cookies.get('userId');

        if (userId === undefined) {
            return ctx.redirect('/login');
        }

        const readerStr = userDB.getUserStrById(userId);
        const reader = new Reader(readerStr);

        await ctx.render('profile', {
            reader: reader,
            notifications: reader.getNotifications(),
            loanRecords: reader.getLoanRecords()
        })
    }
);

router.get('/logout', async (ctx) => {
    ctx.cookies.set('userId', undefined);

    await ctx.redirect('/');
});

router.get('/librarian', async (ctx) => {
    const userId = ctx.cookies.get('userId');

    if (userId === undefined) {
        return await ctx.redirect('/login');
    }

    const userStr = userDB.getUserStrById(userId);
    const user = new User(userStr);

    if (!user.isLibrarian()) {
        return await ctx.redirect('/login');
    }

    await ctx.render('librarian', {librarian: new Librarian(userStr)});
});

router.get('/admin', async (ctx) => {
    const userId = ctx.cookies.get('userId');

    if (userId === undefined) {
        return await ctx.redirect('/login');
    }

    const userStr = userDB.getUserStrById(userId);
    const user = new User(userStr);

    if (!user.isAdmin()) {
        ctx.cookies.set('userId', undefined);
        return await ctx.redirect('/login');
    }

    await ctx.render('admin', {admin: new Admin(userStr)});
});

router.post('/admin', async (ctx, result) => {
    const res = ctx.request.body;

    if (typeof res.username !== 'undefined') {
        console.log('Adding librarian');
        await addLibrarian(res).then(ctx.redirect('/admin'));
    } else {
        console.log('Deleting librarian');
    }
});

router.post('/librarian', async (ctx, result) => {
    const res = ctx.request.body;

    if (typeof res.title !== 'undefined') {
        await bookDB.db.addBook(res.title, res.author, res.publishHouse, res.edition).then(ctx.redirect('/librarian'));
    } else {
        loanBook(ctx, res);
    }
});

router.post('/bookAction', async (ctx) => {
    const userId = ctx.cookies.get('userId');

    if (userId === undefined) {
        return await ctx.redirect('login');
    }

    const action = ctx.request.body.action;

    if (action === 'enqueue') {
        console.log('join queue');
    } else if (action === 'reserve') {
        console.log('reserve');
    } else {
        throw new Error('Unrecognized action status');
    }
});

module.exports = router;