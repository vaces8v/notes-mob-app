import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://cwnotes.store/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});
