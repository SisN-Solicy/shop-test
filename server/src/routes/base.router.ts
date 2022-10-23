import Router from '@koa/router';
import adminRouter from './admin.router';
import authRouter from './auth.router';
import productRouter from './product.router';
import userRouter from './user.router';

const baseRouter = new Router();

baseRouter.use('/', authRouter.routes(), authRouter.allowedMethods());
baseRouter.use('/', userRouter.routes(), userRouter.allowedMethods());
baseRouter.use('/', adminRouter.routes(), adminRouter.allowedMethods());
baseRouter.use('/', productRouter.routes(), productRouter.allowedMethods());

export default baseRouter;
