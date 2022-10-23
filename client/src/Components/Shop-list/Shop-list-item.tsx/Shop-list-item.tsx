import { Typography } from '@material-ui/core';
import { useState } from 'react';
import { IUser } from '../../../Hooks/UseRoutes';
import { getItem } from '../../../Utils/LocalStorage';
import { IShopListItem } from '../Shop-list';
import AdminModal from './Shop-list-item-admin-modal/Admin-modal';
import ProductModal from './Shop-list-item-modal/Shop-list-item-modal';

import './Shop-list-item.scss';

interface IProps {
    listItem: IShopListItem;
    removeShopItem?: (id: number) => void;
}

const ShopListItem: React.FC<IProps> = ({ listItem, removeShopItem }) => {
    const user: IUser = getItem('user');
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div className="shop-list-item" onClick={handleOpen}>
                <img
                    src={listItem.image}
                    alt={listItem.title}
                    className="list-item-main-image"
                />
                <div className="shop-list-item-content">
                    <Typography>{listItem.title}</Typography>
                    <Typography>$ {listItem.price}</Typography>
                    <Typography>{listItem.description}</Typography>
                </div>
                {user.isAdmin && (
                    <img
                        src="https://cdn3.iconfinder.com/data/icons/ui-icons-5/16/cross-small-01-512.png"
                        alt="x icon"
                        onClick={() => {
                            removeShopItem && removeShopItem(listItem.id);
                        }}
                        className="list-item-x-icon"
                    />
                )}
            </div>
            {user.isAdmin ? (
                <AdminModal
                    listItem={listItem}
                    open={open}
                    handleClose={handleClose}
                />
            ) : (
                <ProductModal
                    listItem={listItem}
                    open={open}
                    handleClose={handleClose}
                />
            )}
        </>
    );
};

export default ShopListItem;
