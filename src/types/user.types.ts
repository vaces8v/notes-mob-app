
export interface IUser {
    id: number;
    name: string;
    last_name: string;
    email: string;
    password_hash: string;
}

export interface IResToken {
    token: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    name: string;
    last_name: string;
    email: string;
    password: string;
}