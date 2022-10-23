import { DefaultContext } from 'koa';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class UserController {
    public static async get(ctx: DefaultContext) {
        const { id } = ctx.user;
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: +id
                }
            });
            ctx.body = {
                data: user
            };
        } catch (err: any) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
        return ctx.body;
    }
}
