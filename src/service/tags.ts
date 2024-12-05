import {axiosInstance} from "@/service/instance";
import {ITag} from "@/types/tag.types";

export const getAll = async (): Promise<ITag[]> => {
    const {data} = await axiosInstance.get<ITag[]>("/tags/", {
        headers: {
            Authorization: `Bearer`
        }
    });
    return data;
}