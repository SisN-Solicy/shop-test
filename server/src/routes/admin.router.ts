import Router from '@koa/router';
import parseJWT from '../middlewares/parseJWT';
import isAdmin from '../middlewares/isAdmin';
import { upload } from '../middlewares/uploadImage';
import AdminController from '../controllers/admin.controller';

const adminRouter = new Router({
    prefix: 'admin'
});

adminRouter.post(
    '/add-product',
    parseJWT,
    isAdmin,
    upload.single('image'),
    AdminController.addProduct
);

export default adminRouter;
