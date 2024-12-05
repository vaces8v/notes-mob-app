import {IResToken, IUser, LoginDTO, RegisterDTO} from "@/types/user.types";
import {axiosInstance} from "@/service/instance";
import * as SecureStore from 'expo-secure-store';

export const login = async (body: LoginDTO): Promise<IResToken> => {
    try {
        const {data} = await axiosInstance.post<IResToken>("/users/login", body);
        return data;
    } catch (error) {}
}

export const register = async (body: RegisterDTO): Promise<IResToken> => {
    const {data} = await axiosInstance.post<IResToken>("/users/", body);
    await SecureStore.setItemAsync('token', data.token);
    return data;
}


export const getProfile = async (): Promise<IUser> => {
    const token = await SecureStore.getItemAsync('token');
    try {
        const {data} = await axiosInstance.get<IUser>("/users/profile",  {
            headers: {
                authorization: `Bearer ${token}`,
            }
        });
        return data;
    } catch (error) {
        
    }
}