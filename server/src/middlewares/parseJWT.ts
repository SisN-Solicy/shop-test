import { DefaultContext } from 'koa';
import jwt from 'jsonwebtoken';

import config from '../config/config';

export default async (ctx: DefaultContext, next: () => Promise<any>) => {
    try {
        const header = ctx.request.headers['authorization'];
        const token = header.replace('Bearer ', '');

        const decoded = jwt.verify(token, config.JWT_SECRET);

        ctx.user = decoded;

        await next();
    } catch (err) {
        ctx.status = 403;
        return (ctx.body = 'Forbidden');
    }
};
