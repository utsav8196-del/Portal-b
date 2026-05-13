import api from './api'; // your axios instance with baseURL and withCredentials

export const getSettings = async () => {
    const response = await api.get('/api/settings');
    return response.data;
};

export const updateSettings = async (data) => {
    const response = await api.put('/api/settings', data);
    return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
    const response = await api.post('/api/auth/change-password', { oldPassword, newPassword });
    return response.data;
};