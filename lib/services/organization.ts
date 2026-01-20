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

/**
 * Fetch organization details for the currently authenticated user
 */
export const getMyOrganization = async (): Promise<OrganizationResponse> => {
    const response = await api.get<OrganizationResponse>('/organizations/me');
    return response.data;
};

/**
 * Fetch all organizations that the user is a member of
 */
export const getUserOrganizations = async (): Promise<UserOrganizationsResponse> => {
    const response = await api.get<UserOrganizationsResponse>('/organizations/my-organizations');
    return response.data;
};

/**
 * Leave an organization (for individual users)
 */
export const leaveOrganization = async (organizationId: string): Promise<{ success: true; message: string }> => {
    const response = await api.post(`/organizations/leave`, { organizationId });
    return response.data;
};

/**
 * Switch the active organization context for the user
 */
export const switchOrganization = async (organizationId: string | null): Promise<{ success: true; message: string }> => {
    const response = await api.post('/organizations/switch', { organizationId });
    return response.data;
};

export const createOrganization = async (name: string, slug?: string): Promise<{ success: true, data: Organization }> => {
    const response = await api.post('/organizations/create', { name, slug });
    // @ts-ignore
    return response.data;
};

export const updateOrganization = async (orgId: string, data: { name?: string; slug?: string; logo?: string }): Promise<{ success: true, data: Organization }> => {
    const response = await api.patch<{ success: true, data: Organization }>(`/organizations/${orgId}`, data);
    return response.data;
};

export const deleteOrganization = async (orgId: string): Promise<{ success: true }> => {
    const response = await api.delete<{ success: true }>(`/organizations/${orgId}`);
    return response.data;
};

export const inviteMember = async (orgId: string, email: string, role: string): Promise<{ success: true; message: string }> => {
    const response = await api.post<{ success: true; message: string }>(`/organizations/${orgId}/invitations`, { email, role });
    return response.data;
};
