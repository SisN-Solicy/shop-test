import axios from 'axios';
import { getItem } from '../Utils/LocalStorage';

export const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        Authorization: 'Bearer ' + getItem('access_token') || ''
    }
});

export interface IResponse<T> {
    data: T;
}
