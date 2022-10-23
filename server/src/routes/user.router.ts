import Router from '@koa/router';
import UserController from '../controllers/user.controller';
import parseJWT from '../middlewares/parseJWT';

const userRouter = new Router({
    prefix: 'user'
});

userRouter.get('/me', parseJWT, UserController.get);

export default userRouter;
