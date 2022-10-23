import { DefaultContext } from 'koa';
import { PrismaClient } from '@prisma/client';
import config from '../config/config';

const prisma = new PrismaClient();

export default class AdminController {
    public static async addProduct(ctx: DefaultContext) {
        try {
            const image = config.BASE_URL + '/' + ctx.file.filename;
            const product = {
                data: {
                    ...ctx.request.body,
                    image,
                    price: +ctx.request.body.price
                }
            };

            const newProduct = await prisma.product.create(product);

            ctx.status = 201;
            ctx.body = {
                message: 'Product added successfully',
                data: newProduct
            };
        } catch (err: any) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
        return ctx.body;
    }
}
