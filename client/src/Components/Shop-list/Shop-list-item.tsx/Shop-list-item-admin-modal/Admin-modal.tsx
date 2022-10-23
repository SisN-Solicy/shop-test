import { Modal, Box } from '@material-ui/core';
import { useContext, useState } from 'react';
import { API } from '../../../../Api/Axios';
import {
    AdminContext,
    IAdminContextInterface
} from '../../../../Pages/Admin-interface/Admin-interface';
import { IShopListItem } from '../../Shop-list';

import './Admin-modal.scss';

interface IProps {
    listItem: IShopListItem;
    open: boolean;
    handleClose: () => void;
}

const AdminModal: React.FC<IProps> = ({ listItem, handleClose, open }) => {
    const [product, setProduct] = useState<IShopListItem>(listItem);
    const { setShopList } = useContext(AdminContext) as IAdminContextInterface;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'price' && !+e.target.value) return;
        setProduct((prd) => {
            const name = e.target.name as never;
            prd[name] = e.target.value as never;
            return { ...prd };
        });
    };

    const handleUpdate = async () => {
        const data = { ...product, id: undefined };

        try {
            await API.put(`/product/${product.id}`, data);
            setShopList((items) =>
                items.map((elem) => (elem.id === product.id ? product : elem))
            );
        } catch (err) {
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
            <Box className="admin-modal">
                <img src={product.image} alt={product.title} />
                <div>
                    <span>Title: </span>
                    <input
                        type="text"
                        value={product.title}
                        name="title"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                        }}
                    />
                </div>
                <div>
                    <span>Price: </span>
                    <input
                        type="text"
                        value={product.price}
                        name="price"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                        }}
                    />
                </div>
                <div>
                    <span>Description: </span>
                    <input
                        type="text"
                        value={product.description}
                        name="description"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                        }}
                    />
                </div>
                <button onClick={handleUpdate}>Submit</button>
            </Box>
        </Modal>
    );
};

export default AdminModal;
