import {ITag} from "@/types/tag.types";

export interface INoteDTO {
    title: string;
    description: string;
    noteTags: number[]
}

export interface INoteRes {
    id: number;
    title: string;
    description: string;
    isArchive: string;
    authorId: number;
    noteTags: ITag[];
}

export interface RootResNotes{
    id: number;
    title: string;
    description: string;
    is_archive: boolean;
    user_id: number;
    created_at: Date;
    updated_at: Date;
    tags: Tag[];
}

export interface Tag {
    id: number;
    name: string;
    color: string;
}