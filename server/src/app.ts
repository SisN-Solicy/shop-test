import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import cors from '@koa/cors';
import koaStatic from 'koa-static';

import baseRouter from './routes/base.router';

const app = new Koa();

app.use(koaStatic('src/public/uploads'));
app.use(cors());
app.use(json());
app.use(bodyParser());
app.use(logger());

app.use(baseRouter.routes()).use(baseRouter.allowedMethods());

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
