import api from '../axios';
import { User } from '@/constants/data';

type FilterParams = {
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
};

export async function getUsers(params: FilterParams) {
    const res = await api.get('/users', { params });
    return res.data;
}

export async function getUserById(userId: number): Promise<User | null> {
    try {
        const res = await api.get(`/users/${userId}`);
        if (!res.data.user) return null;

        const user = res.data.user;
        // Ubah userId jadi id
        return {
            ...user,
            id: user.userId,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateUser(userId: number, data: Partial<User>) {
    const res = await api.put(`/users/${userId}`, data);
    const user = res.data.user;
    // Ubah userId jadi id
    return {
        ...user,
        id: user.userId,
    };
}

export async function deleteUser(userId: number) {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
}