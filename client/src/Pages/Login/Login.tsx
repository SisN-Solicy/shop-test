import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '@material-ui/core';
import * as yup from 'yup';

import { API } from '../../Api/Axios';
import { setItem } from '../../Utils/LocalStorage';

import './Login.scss';

interface ILoginInputs {
    email: string;
    password: string;
}

interface IResponse {
    data: string;
    message: string;
    status: string;
}

const schema = yup.object().shape({
    email: yup.string().required('Email is required'),
    password: yup.string().min(6).required('Password is required')
});

const Login = () => {
    const [error, setError] = useState('');
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<ILoginInputs>({ resolver: yupResolver(schema) });

    const onSubmit: SubmitHandler<ILoginInputs> = async (user) => {
        try {
            const { data } = await API.post<IResponse>('/sign-in', user);
            setItem('access_token', data.data);
            setItem('cart', []);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response.data.message);
        }
    };

    return (
        <div className="login-background">
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <Link className="login-link" to="/register">
                    Register
                </Link>
                <h1>Login</h1>
                {error && <span className="login-error">{error}</span>}
                <Controller
                    name="email"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <TextField
                            className="login-input"
                            {...field}
                            label="Email"
                            variant="outlined"
                            error={!!errors.email}
                            helperText={
                                errors.email ? errors.email?.message : ''
                            }
                            fullWidth
                            margin="dense"
                        />
                    )}
                />
                <Controller
                    name="password"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            className="login-input"
                            type="password"
                            label="Password"
                            variant="outlined"
                            error={!!errors.password}
                            helperText={
                                errors.password ? errors.password?.message : ''
                            }
                            fullWidth
                            margin="dense"
                        />
                    )}
                />
                <input type="submit" value="Login" className="login-submit" />
            </form>
        </div>
    );
};

export default Login;
