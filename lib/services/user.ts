import api from '../api';
import { User, ProfileResponse } from '../types';

// Profile Routes
export const getProfile = async () => {
    const response = await api.get<ProfileResponse<User>>('/profile');
    return response.data;
};

export const updateProfile = async (data: Partial<User>) => {
    const response = await api.put<ProfileResponse<User>>('/profile', data);
    return response.data;
};

export const uploadProfileImage = async (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const response = await api.post<ProfileResponse<{ imageUrl: string; user: User }>>('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
};

export const deleteProfileImage = async () => {
    const response = await api.delete<ProfileResponse<{ id: string; image: null }>>('/profile/image');
    return response.data;
};

// Admin Routes
export const getUsers = async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
};

export const getUser = async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
};

export const updateUser = async (id: string, data: Partial<User>) => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: string) => {
    await api.delete(`/users/${id}`);
};
