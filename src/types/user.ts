export interface Grade {
    id: number;
    gradeNumber: number;
    description: string;
}

export interface UserProfile {
    id: number;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    branchName?: string;
    warehouseId?: number;
    position?: string;
    gradeId?: number;
    gradeNumber?: number;
    gradeDescription?: string;
    roles: string[];
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}
