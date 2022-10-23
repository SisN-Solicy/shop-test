import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { API } from '../Api/Axios';
import { UserProvider } from '../Contexts/User-context';
import AdminInterface from '../Pages/Admin-interface/Admin-interface';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import UserHome from '../Pages/User-home/User-home';
import { setItem } from '../Utils/LocalStorage';

export interface IUser {
    id: number;
    email: string;
    isAdmin: boolean;
    balance: number;
}

export const useRoutes = () => {
    const token = localStorage.getItem('access_token');
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const fetchMe = async () => {
            const { data } = await API.get<{ data: IUser; status: string }>(
                '/user/me'
            );
            setUser(data.data);
            setItem('user', data.data);
        };
        token && fetchMe();
    }, [token]);

    if (token) {
        if (!user) return null;
        return (
            <>
                {user?.isAdmin ? (
                    <Routes>
                        <Route path="/" element={<AdminInterface />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                ) : (
                    <UserProvider>
                        <Routes>
                            <Route path="/" element={<UserHome />} />
                            <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                            />
                        </Routes>
                    </UserProvider>
                )}
            </>
        );
    }
    return (
        <Routes>
            <Route path="login" element={<Login></Login>} />
            <Route path="register" element={<Register></Register>} />
            <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
    );
};
