import { DefaultContext } from 'koa';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import config from '../config/config';

const prisma = new PrismaClient();

export default class AuthController {
    public static async singUp(ctx: DefaultContext) {
        const user = ctx.request.body;
        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: user.email
                }
            });

            if (existingUser) {
                ctx.status = 400;
                return (ctx.body = {
                    message: 'User with the given email address already exists'
                });
            }
            const hashedPassword = await bcrypt.hash(user.password, 12);
            const newUser = await prisma.user.create({
                data: {
                    email: user.email,
                    password: hashedPassword
                }
            });

            ctx.body = {
                message: 'User was successfully registered',
                data: AuthController.generateJWT(newUser)
            };
        } catch (err: any) {
            ctx.status = err.status || 500;
            ctx.body = {
                message: err.message
            };
        }
        return ctx.body;
    }

    public static async signIn(ctx: DefaultContext) {
        const { email, password } = ctx.request.body;
        try {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: email
                }
            });

            if (!existingUser) {
                ctx.status = 400;
                return (ctx.body = {
                    message: 'Incorrect email or password'
                });
            }

            const isCorrect = await bcrypt.compare(
                password,
                existingUser.password
            );

            if (!isCorrect) {
                ctx.status = 400;
                return (ctx.body = {
                    message: 'Incorrect email or password'
                });
            }

            ctx.body = {
                message: 'Successful login',
                data: AuthController.generateJWT(existingUser)
            };
        } catch (err: any) {
            ctx.status = err.status || 500;
            ctx.body = {
                message: err.message
            };
        }
        return ctx.body;
    }

    private static generateJWT<T extends Record<string, any>>(user: T) {
        if ('password' in user) delete user.password;
        return jwt.sign(user, config.JWT_SECRET, { expiresIn: '7d' });
    }
}
