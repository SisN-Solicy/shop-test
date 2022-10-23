import { Box, Modal, Snackbar, Typography } from '@material-ui/core';
import { Alert } from '@mui/material';
import { useContext, useState } from 'react';
import { API } from '../../../../Api/Axios';
import {
    IUserContextInterface,
    UserContext
} from '../../../../Contexts/User-context';
import { getItem, setItem } from '../../../../Utils/LocalStorage';
import { IShopListItem } from '../../Shop-list';

import './Shop-list-item-checkout.scss';

interface IProps {
    listItem: IShopListItem;
    open: boolean;
    handleClose: () => void;
}

const CheckoutModal: React.FC<IProps> = ({ listItem, open, handleClose }) => {
    const [count, setCount] = useState(1);
    const [balance, setBalance] = useState(getItem('user').balance);
    const [error, setError] = useState('');

    const { setShopList, shopList } = useContext(
        UserContext
    ) as IUserContextInterface;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 1) setCount(1);
        else setCount(+e.target.value);
    };

    const handleCloseSnackBar = () => setError('');

    const handleBuy = async () => {
        try {
            await API.post('/product/buy', [
                {
                    productId: listItem.id,
                    quantity: count
                }
            ]);
            setCount(1);
            setBalance(balance - count * listItem.price);
            const user = getItem('user');
            setItem('user', {
                ...user,
                balance: balance - count * listItem.price
            });
            setShopList(
                shopList.map((elem) => {
                    if (elem.id === listItem.id)
                        return {
                            ...elem,
                            quantity: elem.quantity
                                ? elem.quantity + count
                                : count
                        };
                    return elem;
                })
            );
        } catch (err: any) {
            setError(err.response.data.message);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="checkout-modal">
                <div className="modal-product">
                    <img
                        src={listItem.image}
                        alt={listItem.title}
                        className="modal-product-image"
                    />
                    <div className="modal-product-content">
                        <Typography>{listItem.title}</Typography>
                        <Typography>$ {listItem.price}</Typography>
                        <Typography>{listItem.description}</Typography>
                    </div>
                </div>
                <span>Balance: {balance}</span>
                <span>Total price: {count * listItem.price}</span>
                <div className="checkout-instructions">
                    <input
                        type="number"
                        onChange={handleChange}
                        value={count}
                    />
                    <button className="modal-button" onClick={handleBuy}>
                        Buy
                    </button>
                </div>
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackBar}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                >
                    <Alert
                        severity="error"
                        sx={{
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </Modal>
    );
};

export default CheckoutModal;
