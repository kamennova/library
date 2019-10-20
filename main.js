const Koa = require('koa');
const app = new Koa();
const logger = require('koa-morgan');
const serve = require('koa-static');

const Router = require('koa-router');
const router = new Router();

const views = require('koa-views');

router.get('/', ctx => ctx.render('index'));

app.use(serve(__dirname + '/css'));
app.use(serve(__dirname + '/js'));
app.use(views(__dirname + '/views', {map: {html: 'ejs'}}));

app.use(logger('tiny'))
    .use(router.routes());

app.listen(3001);