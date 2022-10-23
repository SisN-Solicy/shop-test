import { DefaultContext } from 'koa';

export default async (ctx: DefaultContext, next: () => Promise<any>) => {
    if (!ctx.user.isAdmin) {
        ctx.status = 401;
        return (ctx.body = {
            message: "You don't have proper access to the resource"
        });
    }
    await next();
};
