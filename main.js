const Koa = require('koa');
const app = new Koa();
const logger = require('koa-morgan');
const serve = require('koa-static');
const koaBody = require('koa-bodyparser');
const views = require('koa-views');
const router = require('./backend/router');

app.use(logger('tiny'));
app.use(serve(__dirname + '/css'));
app.use(serve(__dirname + '/js'));
app.use(views(__dirname + '/views', {map: {html: 'ejs'}}));
app.use(koaBody());
app.use(router.routes());
app.listen(3001);