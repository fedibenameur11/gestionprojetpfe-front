import { SujetPfe } from "./sujetpfe";

export interface OurUsers {
    id: number;
    email: string;
    name: string;
    password: string;
    city: string;
    image: string;
    numTel: number;
    CIN: number;
    role: UserRole;
    status: UserStatus;
    moderatedSujets: SujetPfe[];
    attributedSujets: SujetPfe[];
    sujetsPostules: SujetPfe[];
}

export enum UserStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MODERATOR = 'MODERATOR'
}
