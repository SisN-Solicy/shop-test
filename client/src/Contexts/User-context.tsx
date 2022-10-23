import { createContext, ReactNode, useEffect, useState } from 'react';
import { API, IResponse } from '../Api/Axios';
import { IShopListItem } from '../Components/Shop-list/Shop-list';
import { getItem, setItem } from '../Utils/LocalStorage';

interface IProps {
    children: ReactNode;
}

export interface IUserContextInterface {
    shopList: IShopListItem[];
    setShopList: React.Dispatch<React.SetStateAction<IShopListItem[]>>;
    removeFromCart: (id: number) => void;
    addCart: (item: IShopListItem) => void;
    cart: IShopListItem[];
    setCart: React.Dispatch<React.SetStateAction<IShopListItem[]>>;
}

export const UserContext = createContext<IUserContextInterface | null>(null);

export const UserProvider: React.FC<IProps> = ({ children }) => {
    const [shopList, setShopList] = useState<IShopListItem[]>([]);
    const [cart, setCart] = useState<IShopListItem[]>(getItem('cart'));

    const removeFromCart = (id: number) => {
        const filteredCart = cart.filter((elem) => elem.id !== id);
        setItem('cart', filteredCart);
        setCart(filteredCart);
    };

    const addCart = (item: IShopListItem) => {
        setCart((crt) => {
            setItem('cart', [...crt, item]);
            return [...crt, item];
        });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const {
                data: { data }
            } = await API.get<IResponse<IShopListItem[]>>(
                '/product/with-bought'
            );
            setShopList(data);
        };
        fetchProducts();
    }, []);
    return (
        <UserContext.Provider
            value={{
                shopList,
                setShopList,
                removeFromCart,
                addCart,
                cart,
                setCart
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
