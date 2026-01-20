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
        const response = await api.post(`/organizations/leave`, { organizationId });
        return response.data;
    },

    /**
     * Switch the active organization context for the user
     */
    async switchOrganization(organizationId: string): Promise<{ success: true; message: string }> {
        const response = await api.post('/organizations/switch', { organizationId });
        return response.data;
    },

    async createOrganization(name: string, slug?: string): Promise<{ success: true, data: Organization }> {
        const response = await api.post('/organizations/create', { name, slug });
        // @ts-ignore
        return response.data;
    },

    async updateOrganization(orgId: string, data: { name?: string; slug?: string; logo?: string }): Promise<{ success: true, data: Organization }> {
        const response = await api.patch<{ success: true, data: Organization }>(`/organizations/${orgId}`, data);
        return response.data;
    },

    async deleteOrganization(orgId: string): Promise<{ success: true }> {
        const response = await api.delete<{ success: true }>(`/organizations/${orgId}`);
        return response.data;
    },

    async inviteMember(orgId: string, email: string, role: string): Promise<{ success: true; message: string }> {
        const response = await api.post<{ success: true; message: string }>(`/organizations/${orgId}/invitations`, { email, role });
        return response.data;
    }
};
