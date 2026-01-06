import api from '@/lib/api';

export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    metadata?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrganizationResponse {
    success: boolean;
    data: Organization;
}

export const organizationService = {
    /**
     * Fetch organization details for the currently authenticated user
     */
    async getMyOrganization(): Promise<OrganizationResponse> {
        const response = await api.get<OrganizationResponse>('/organizations/me');
        return response.data;
    },
};
