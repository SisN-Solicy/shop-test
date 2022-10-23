import { DefaultContext } from 'koa';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export default class ProductController {
    public static async getAll(ctx: DefaultContext) {
        try {
            const products = await prisma.product.findMany();
            ctx.body = {
                data: products
            };
        } catch (err: any) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
        return ctx.body;
    }

    public static async delete(ctx: DefaultContext) {
        const { id } = ctx.params;

        try {
            const product = await prisma.product.delete({
                where: {
                    id: +id
                }
            });
            ctx.body = {
                data: product
            };

            const imagePath =
                path.join(__dirname, '../public/uploads/') +
                product.image.replace('http://localhost:5000/', '');

            fs.unlink(imagePath, () => {
                ctx.body = {
                    message: 'Product delete successfully!'
                };
            });
        } catch (err: any) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
        return ctx.body;
    }

    public static async getWithBought(ctx: DefaultContext) {
        try {
            const products = await prisma.product.findMany({
                include: {
                    users: true
                }
            });

            const result = products.map((product) => {
                const productItem = product.users.find(
                    (elem) => elem.userId === ctx.user.id
                );
                if (productItem)
                    return {
                        ...product,
                        users: undefined,
                        quantity: productItem.quantity
                    };
                return { ...product, users: undefined, quantity: 0 };
            });
            ctx.body = {
                data: result
            };
        } catch (err: any) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
        return ctx.body;
    }

    public static async buy(ctx: DefaultContext) {
        type ProductList = {
            productId: number;
            quantity: number;
        };

        const { id: userId }: { id: number } = ctx.user;
        const productList: ProductList[] = ctx.request.body;

        const productIdList = productList.map((elem) => elem.productId);

        const findProdQuant = (id: number) =>
            productList.find((elem) => elem.productId === id)?.quantity || 0;

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if (!user) {
                ctx.status = 404;
                return (ctx.body = {
                    message: 'User not found!'
                });
            }

            const products = await prisma.product.findMany({
                where: {
                    id: {
                        in: productIdList
                    }
                }
            });

            const totalPrice = products.reduce(
                (acc, curr) => acc + curr.price * findProdQuant(curr.id),
                0
            );

            if (totalPrice > user.balance) {
                ctx.status = 400;
                return (ctx.body = {
                    message: 'Insufficient balance!'
                });
            }

            const userProducts = await prisma.userProduct.findMany({
                where: {
                    userId,
                    productId: {
                        in: productIdList
                    }
                }
            });

            const existingProducts: ProductList[] = [],
                newProducts: ProductList[] = [];

            productList.forEach((elem) => {
                const userProduct = userProducts.find(
                    (e) => e.productId === elem.productId
                );
                if (elem.productId === userProduct?.productId) {
                    existingProducts.push({
                        ...elem,
                        quantity: elem.quantity + userProduct.quantity
                    });
                } else {
                    newProducts.push(elem);
                }
            });

            const promises: Promise<any>[] = [];

            existingProducts.forEach((elem) => {
                promises.push(
                    prisma.userProduct.update({
                        where: {
                            userId_productId: {
                                userId,
                                productId: elem.productId
                            }
                        },
                        data: {
                            quantity: elem.quantity
                        }
                    })
                );
            });

            const data = newProducts.map((elem) => ({
                userId,
                productId: elem.productId,
                quantity: elem.quantity
            }));

            promises.push(
                prisma.userProduct.createMany({
                    data
                })
            );

            promises.push(
                prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        balance: user.balance - totalPrice
                    }
                })
            );

            await Promise.all(promises);

            ctx.body = {
                message: 'Items purchased successfully!'
            };
        } catch (err: any) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
        return ctx.body;
    }

    public static async update(ctx: DefaultContext) {
        const product = ctx.request.body;
        const { id } = ctx.params;

        try {
            await prisma.product.update({
                data: { ...product, price: +product.price },
                where: {
                    id: +id
                }
            });

            ctx.body = {
                message: 'Product updated successfully!'
            };
        } catch (err: any) {
            console.log(err);
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
        return ctx.body;
    }
}
