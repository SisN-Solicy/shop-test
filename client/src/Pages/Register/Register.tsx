import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '@material-ui/core';
import * as yup from 'yup';

import { API } from '../../Api/Axios';
import { setItem } from '../../Utils/LocalStorage';

import './Register.scss';

interface IRegisterInputs {
    email: string;
    password: string;
    repeatPassword: string;
}

interface IResponse {
    data: string;
    message: string;
    status: string;
}

const schema = yup.object().shape({
    email: yup.string().required('email is required').email(),
    password: yup.string().min(6).required('password is required'),
    repeatPassword: yup
        .string()
        .oneOf([yup.ref('password'), null])
        .required()
});

const Register = () => {
    const [error, setError] = useState('');

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<IRegisterInputs>({ resolver: yupResolver(schema) });
    const onSubmit: SubmitHandler<IRegisterInputs> = async (user) => {
        try {
            const { data } = await API.post<IResponse>('/sign-up', user);
            setItem('access_token', data.data);
            setItem('cart', []);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response.data.message);
        }
    };

    return (
        <div className="register-background">
            <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
                <Link className="register-link" to="/login">
                    Login
                </Link>
                <h1>Registration</h1>
                {error && <span className="register-error">{error}</span>}
                <Controller
                    name="email"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <TextField
                            className="register-input"
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
                            className="register-input"
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
                <Controller
                    name="repeatPassword"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            className="register-input"
                            type="password"
                            label="Repeat password"
                            variant="outlined"
                            error={!!errors.repeatPassword}
                            helperText={
                                errors.repeatPassword
                                    ? errors.repeatPassword?.message
                                    : ''
                            }
                            fullWidth
                            margin="dense"
                        />
                    )}
                />
                <input
                    type="submit"
                    value="Register"
                    className="register-submit"
                />
            </form>
        </div>
    );
};

export default Register;
