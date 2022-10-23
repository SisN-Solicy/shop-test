import { useContext, useState } from 'react';
import Cart from '../../Components/Common/Buttons/Cart/Cart';
import LogOut from '../../Components/Common/Buttons/Log-out/Log-out';
import ShopList from '../../Components/Shop-list/Shop-list';
import {
    IUserContextInterface,
    UserContext
} from '../../Contexts/User-context';

import './User-home.scss';

const UserHome = () => {
    const { shopList } = useContext(UserContext) as IUserContextInterface;
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleClose = () => {
        setIsCartOpen(false);
    };

    return (
        <div className="User-home">
            <ShopList list={shopList} />
            <LogOut />
            <Cart open={isCartOpen} handleClose={handleClose} />
            <div className="cart-button" onClick={() => setIsCartOpen(true)}>
                <img
                    src="https://freeiconshop.com/wp-content/uploads/edd/cart-outline.png"
                    alt="cart-icon"
                />
            </div>
        </div>
    );
};

export default UserHome;
