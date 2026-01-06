export interface Permission {
    id: number;
    name: string;
    description: string;
    module: string;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];
}

export interface Grade {
    id: number;
    gradeNumber: number;
    description: string;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    branchName?: string;
    position?: string;
    gradeId?: number;
    gradeNumber?: number;
    gradeDescription?: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}
