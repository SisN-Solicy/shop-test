import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextareaAutosize, TextField } from '@material-ui/core';
import * as yup from 'yup';
import { API, IResponse } from '../../../Api/Axios';

import './Shop-list-item-add.scss';
import { IShopListItem } from '../Shop-list';

const schema = yup.object().shape({
    title: yup.string().required('Enter the title'),
    price: yup.number().required('Enter the price'),
    description: yup.string()
});

interface IProps {
    addShopListItem: (item: IShopListItem) => void;
}

const ShopListItemAdd: React.FC<IProps> = ({ addShopListItem }) => {
    const [imageURL, setImageURL] = useState('');

    const {
        control,
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });

    const uploadImage = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        setImageURL(URL.createObjectURL(file));
    };

    const onSubmit = async (product: any) => {
        const formData = new FormData();
        formData.append('image', product.image[0]);
        formData.append('title', product.title);
        formData.append('description', product.description);
        formData.append('price', product.price);

        try {
            const {
                data: { data }
            } = await API.post<IResponse<IShopListItem>>(
                '/admin/add-product',
                formData
            );

            reset();
            setImageURL('');
            addShopListItem(data);
        } catch (err: any) {
            console.log(err);
        }
    };

    return (
        <form className="shop-list-item-add" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="title"
                defaultValue=""
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Title"
                        variant="outlined"
                        error={!!errors.title}
                        fullWidth
                        margin="dense"
                    />
                )}
            />
            <Controller
                name="price"
                defaultValue=""
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Price"
                        variant="outlined"
                        error={!!errors.price}
                        fullWidth
                        margin="dense"
                    />
                )}
            />
            <Controller
                name="description"
                defaultValue=""
                control={control}
                render={({ field }) => (
                    <TextareaAutosize
                        {...field}
                        aria-label="empty textarea"
                        placeholder="Description"
                        style={{ width: 200 }}
                    />
                )}
            />
            {imageURL && (
                <img
                    src={imageURL}
                    alt="selectedImage"
                    className="shop-item-image"
                />
            )}
            <label className="product-add-button">
                <input
                    type="file"
                    {...register('image')}
                    name="image"
                    onChange={uploadImage}
                />
                <span>Choose File</span>
            </label>
            <input
                type="submit"
                value="Add Item"
                className="product-add-button"
            />
        </form>
    );
};

export default ShopListItemAdd;
