import { Modal, Box } from '@material-ui/core';
import { useContext, useState } from 'react';
import { API } from '../../../../Api/Axios';
import {
    IUserContextInterface,
    UserContext
} from '../../../../Contexts/User-context';
import { getItem, setItem } from '../../../../Utils/LocalStorage';
import ShopList from '../../../Shop-list/Shop-list';

import './Cart.scss';

interface IProps {
    open: boolean;
    handleClose: () => void;
}

const Cart: React.FC<IProps> = ({ open, handleClose }) => {
    const user = getItem('user');
    const [balance, setBalance] = useState<number>(user.balance);

    const { cart, setCart, setShopList } = useContext(
        UserContext
    ) as IUserContextInterface;
    const totalPrice = cart.reduce((acc, curr) => acc + curr.price, 0);

    const handleBuyAll = async () => {
        try {
            const data = cart.map((elem) => ({
                productId: elem.id,
                quantity: 1
            }));
            await API.post('/product/buy', data);
            setCart([]);
            setBalance(balance - totalPrice);
            setItem('user', { ...user, balance: balance - totalPrice });
            setShopList((list) =>
                list.map((elem) => ({
                    ...elem,
                    quantity: elem.quantity ? elem.quantity++ : 1
                }))
            );
        } catch (err: any) {
            console.log(err);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="cart-modal">
                <div className="cart-modal-body">
                    <ShopList list={cart} />
                </div>
                <div className="cart-modal-footer">
                    <button onClick={() => handleBuyAll()}>Buy All</button>
                    <span>Balance: {balance}$</span>
                    <span>Total Price: {totalPrice}$</span>
                </div>
            </Box>
        </Modal>
    );
};

export default Cart;
