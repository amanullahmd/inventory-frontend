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
