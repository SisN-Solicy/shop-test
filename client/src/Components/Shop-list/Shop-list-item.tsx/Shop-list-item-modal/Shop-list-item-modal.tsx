import { Modal, Box, Typography } from '@material-ui/core';
import { useContext, useState } from 'react';
import {
    IUserContextInterface,
    UserContext
} from '../../../../Contexts/User-context';
import { IUser } from '../../../../Hooks/UseRoutes';
import { getItem } from '../../../../Utils/LocalStorage';
import { IShopListItem } from '../../Shop-list';
import CheckoutModal from '../Shop-list-item-checkout/Shop-list-item-checkout';

import './Shop-list-item-modal.scss';

interface IProps {
    listItem: IShopListItem;
    open: boolean;
    handleClose: () => void;
}

const ProductModal: React.FC<IProps> = ({ open, handleClose, listItem }) => {
    const user: IUser = getItem('user');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const { removeFromCart, addCart, cart } = useContext(
        UserContext
    ) as IUserContextInterface;

    const inCart = cart.find((elem) => elem.id === listItem.id);

    const handleCheckoutOpen = () => {
        setIsCheckoutOpen(true);
    };

    const handleCheckoutClose = () => {
        setIsCheckoutOpen(false);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="shop-item-modal">
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
                {!user.isAdmin && (
                    <>
                        <span className="modal-quantity">
                            Quantity Purchased {listItem.quantity}
                        </span>
                        <div className="product-buttons">
                            {!inCart ? (
                                <button
                                    className="modal-button"
                                    onClick={() => addCart(listItem)}
                                >
                                    Add Cart
                                </button>
                            ) : (
                                <button
                                    className="modal-button"
                                    onClick={() => removeFromCart(listItem.id)}
                                >
                                    Remove from cart
                                </button>
                            )}
                            <button
                                className="modal-button"
                                onClick={handleCheckoutOpen}
                            >
                                Buy
                            </button>
                        </div>
                        <CheckoutModal
                            handleClose={handleCheckoutClose}
                            open={isCheckoutOpen}
                            listItem={listItem}
                        />
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default ProductModal;
