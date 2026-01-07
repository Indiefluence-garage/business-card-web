import api from '../api';

export interface Invitation {
    id: string;
    email: string;
    role: 'member' | 'admin';
    token?: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    expiresAt: Date;
    invitedBy?: string;
    invitedByName?: string;
    organizationName?: string;
    organizationSlug?: string;
    createdAt?: Date;
}

export interface Member {
    id: string;
    userId: string;
    name: string;
    email: string;
    image?: string;
    role: string;
    joinedAt: Date;
}

export interface MembersResponse {
    success: true;
    members: {
        joined: Member[];
        pending: Invitation[];
    };
}

export interface InvitationResponse {
    success: true;
    invitation: Invitation;
}

export const invitationService = {
    /**
     * Send invitation to join organization
     */
    async sendInvitation(email: string, role: 'member' | 'admin'): Promise<InvitationResponse> {
        const response = await api.post<InvitationResponse>('/organizations/invite', { email, role });
        return response.data;
    },

    /**
     * Res end pending invitation
     */
    async resendInvitation(invitationId: string): Promise<InvitationResponse> {
        const response = await api.post<InvitationResponse>('/organizations/invite/resend', { invitationId });
        return response.data;
    },

    /**
     * Get all members and pending invitations for current organization
     */
    async getMembers(): Promise<MembersResponse> {
        const response = await api.get<MembersResponse>('/organizations/members');
        return response.data;
    },

    /**
     * Get invitation details by token
     */
    async getInvitationByToken(token: string): Promise<{ success: true; invitation: Invitation }> {
        const response = await api.get(`/invitations/${token}`);
        return response.data;
    },

    /**
     * Accept invitation
     */
    async acceptInvitation(token: string): Promise<{ success: true; message: string; organization: any }> {
        const response = await api.post(`/invitations/${token}/accept`);
        return response.data;
    },

    /**
     * Decline invitation
     */
    async declineInvitation(token: string): Promise<{ success: true; message: string }> {
        const response = await api.post(`/invitations/${token}/decline`);
        return response.data;
    },

    /**
     * Cancel/delete pending invitation
     */
    async cancelInvitation(invitationId: string): Promise<{ success: true; message: string }> {
        const response = await api.delete(`/organizations/invitations/${invitationId}`);
        return response.data;
    },
};
