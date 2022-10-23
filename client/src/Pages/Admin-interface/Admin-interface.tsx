import { useEffect, useState, createContext } from 'react';
import { API, IResponse } from '../../Api/Axios';
import LogOut from '../../Components/Common/Buttons/Log-out/Log-out';
import ShopList, { IShopListItem } from '../../Components/Shop-list/Shop-list';
import ShopListItemAdd from '../../Components/Shop-list/Shop-list-item-add/Shop-list-item-add';

import './Admin-interface.scss';

export interface IAdminContextInterface {
    setShopList: React.Dispatch<React.SetStateAction<IShopListItem[]>>;
}

export const AdminContext = createContext<IAdminContextInterface | null>(null);

const AdminInterface = () => {
    const [shopList, setShopList] = useState<IShopListItem[]>([]);
    useEffect(() => {
        const fetchProducts = async () => {
            const {
                data: { data }
            } = await API.get<IResponse<IShopListItem[]>>('/product');
            setShopList(data);
        };
        fetchProducts();
    }, []);

    const addShopListItem = (item: IShopListItem) => {
        setShopList([item, ...shopList]);
    };

    const removeShopItem = async (id: number) => {
        setShopList(shopList.filter((elem) => elem.id !== id));
        await API.delete(`/product/${id}`);
    };

    return (
        <AdminContext.Provider value={{ setShopList }}>
            <div className="admin-interface">
                <ShopList list={shopList} removeShopItem={removeShopItem} />
                <ShopListItemAdd addShopListItem={addShopListItem} />
                <LogOut />
            </div>
        </AdminContext.Provider>
    );
};

export default AdminInterface;
