import Router from '@koa/router';
import AuthController from '../controllers/auth.controller';

const authRouter = new Router();

authRouter
    .post('sign-up', AuthController.singUp)
    .post('sign-in', AuthController.signIn);

export default authRouter;
