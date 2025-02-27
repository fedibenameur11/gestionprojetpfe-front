import { OurUsers } from "./users";

export interface SujetPfe {
    id?: number;
    titre: string;
    description: string;
    technologie: string;
    image?: string;
    demandeStatus: DemandeStatus;
    moderator: OurUsers | null;  // Accepter null
    userAttribue: OurUsers | null;  // Accepter null
    demandeurs: OurUsers[];
}

export enum DemandeStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}