import api from '../api';

export interface Contact {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    displayPictureUrl?: string;
    cardImageUrls?: string[];
    address?: string;
    website?: string;
    notes?: string;
    createdAt?: string;
}

export interface ContactsResponse {
    success: boolean;
    data: Contact[];
    total: number;
    page: number;
    limit: number;
    count: number;
}

export const contactService = {
    async getContacts(page = 1, limit = 20): Promise<ContactsResponse> {
        const response = await api.get('/contacts', {
            params: { page, limit },
        });
        return response.data;
    },

    async getContact(id: string): Promise<{ success: boolean; data: Contact }> {
        const response = await api.get(`/contacts/${id}`);
        return response.data;
    },

    async createContact(contactData: Partial<Contact>): Promise<{ success: boolean; data: Contact }> {
        const response = await api.post('/contacts/manual', contactData);
        return response.data;
    },

    async updateContact(id: string, contactData: Partial<Contact>): Promise<{ success: boolean; data: Contact }> {
        const response = await api.put(`/contacts/${id}`, contactData);
        return response.data;
    },

    async deleteContact(id: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/contacts/${id}`);
        return response.data;
    },
};
