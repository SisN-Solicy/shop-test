import Router from '@koa/router';
import ProductController from '../controllers/product.controller';
import isAdmin from '../middlewares/isAdmin';
import parseJWT from '../middlewares/parseJWT';

const productRouter = new Router({
    prefix: 'product'
});

productRouter
    .get('/', parseJWT, ProductController.getAll)
    .delete('/:id', parseJWT, isAdmin, ProductController.delete)
    .get('/with-bought', parseJWT, ProductController.getWithBought)
    .post('/buy', parseJWT, ProductController.buy)
    .put('/:id', parseJWT, isAdmin, ProductController.update);

export default productRouter;
