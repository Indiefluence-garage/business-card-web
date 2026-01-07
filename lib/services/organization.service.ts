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

export interface UserOrganization {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    role: string;
    joinedAt: Date;
}

export interface UserOrganizationsResponse {
    success: boolean;
    data: {
        organizations: UserOrganization[];
    };
}

export const organizationService = {
    /**
     * Fetch organization details for the currently authenticated user
     */
    async getMyOrganization(): Promise<OrganizationResponse> {
        const response = await api.get<OrganizationResponse>('/organizations/me');
        return response.data;
    },

    /**
     * Fetch all organizations that the user is a member of
     */
    async getUserOrganizations(): Promise<UserOrganizationsResponse> {
        const response = await api.get<UserOrganizationsResponse>('/organizations/my-organizations');
        return response.data;
    },

    /**
     * Leave an organization (for individual users)
     */
    async leaveOrganization(organizationId: string): Promise<{ success: true; message: string }> {
        const response = await api.post(`/organizations/leave/${organizationId}`);
        return response.data;
    },
};
