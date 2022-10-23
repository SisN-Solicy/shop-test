import ShopListItem from './Shop-list-item.tsx/Shop-list-item';

import './Shop-list.scss';

export interface IShopListItem {
    id: number;
    price: number;
    title: string;
    description: string;
    image: string;
    quantity?: number;
}

interface IProps {
    list: IShopListItem[];
    removeShopItem?: (id: number) => void;
}

const ShopList: React.FC<IProps> = ({ list, removeShopItem }) => {
    return (
        <div className="shop-list">
            {list.map((elem: IShopListItem) => (
                <ShopListItem
                    key={elem.id}
                    listItem={elem}
                    removeShopItem={removeShopItem}
                />
            ))}
        </div>
    );
};

export default ShopList;
