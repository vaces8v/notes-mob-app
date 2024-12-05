import {INoteDTO, INoteRes, RootResNotes} from "@/types/note.types";
import {axiosInstance} from "@/service/instance";
import * as SecureStore from 'expo-secure-store';

export const getAllMy = async (): Promise<RootResNotes[]> => {
    try {
        const token = await SecureStore.getItemAsync('token');
        const { data } = await axiosInstance.get<RootResNotes[]>("/notes/", {
            headers: {
                authorization: `Bearer ${token}`,
            }
        });
        return data;
    } catch (error) {
        throw error;
    }
}

export const getAllMyArchives = async (): Promise<RootResNotes[]> => {
    try {
        const { data } = await axiosInstance.get<RootResNotes[]>("/notes/archives/");
        return data;
    } catch (error) {
        console.error("Error in getAllMyArchives:", error);
        throw error;
    }
}

export const create = async (body: INoteDTO): Promise<INoteRes> => {
    try {
        const token = await SecureStore.getItemAsync('token');
        const {data} = await axiosInstance.post<INoteRes>("/notes/", body, {
            headers: { Authorization: `Bearer ${token}`},
        });
        return data;
    } catch (error) {
        console.error("Error creating note:", error);
        throw error;
    }
};

export const deleteNote = async (note_id: number) => {
    try {
        const token = await SecureStore.getItemAsync('token');
        await axiosInstance.delete(`/notes/${note_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
        }});
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
}

export const addToArchive = async (note_id: number) => {
    try {
        const {data} = await axiosInstance.patch(`/notes/archive/add/${note_id}`, {});
        return data;
    } catch (error) {
        console.error("Error adding note to archive:", error);
        throw error;
    }
}

export const removeFromArchive = async (note_id: number) => {
    try {
        const {data} = await axiosInstance.patch(`/notes/archive/remove/${note_id}`, {});
        return data;
    } catch (error) {
        console.error("Error removing note from archive:", error);
        throw error;
    }
}

export const getById = async (id: number): Promise<INoteRes> => {
    try {
        const token = await SecureStore.getItemAsync('token');
        const { data } = await axiosInstance.get<INoteRes>(`/notes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        throw error;
    }
};