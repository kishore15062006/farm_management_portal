const API_BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
    const url = `${API_BASE_URL}${path}`;
    const token = localStorage.getItem('farmPortalToken');
    const headers = { 
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers,
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

export const api = {
    auth: {
        login: (email, password, role) => 
            request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, role })
            }),
        register: (userData) => 
            request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            })
    },
    problems: {
        getAll: () => request('/problems'),
        getByFarmer: (farmerId) => request(`/problems/farmer/${farmerId}`),
        getForVet: () => request('/problems/veterinarian'),
        create: (problem) => 
            request('/problems', {
                method: 'POST',
                body: JSON.stringify(problem)
            }),
        update: (problemId, updates) => 
            request(`/problems/${problemId}`, {
                method: 'PUT',
                body: JSON.stringify(updates)
            }),
        delete: (problemId) => 
            request(`/problems/${problemId}`, {
                method: 'DELETE'
            })
    },
    treatments: {
        getAll: () => request('/treatments'),
        getByFarmer: (farmerId) => request(`/treatments/farmer/${farmerId}`),
        getPending: () => request('/treatments/pending'),
        getApproved: (farmerId) => request(`/treatments/approved/farmer/${farmerId}`),
        create: (treatment) => 
            request('/treatments', {
                method: 'POST',
                body: JSON.stringify(treatment)
            }),
        update: (treatmentId, updates) => 
            request(`/treatments/${treatmentId}`, {
                method: 'PUT',
                body: JSON.stringify(updates)
            }),
        delete: (treatmentId) => 
            request(`/treatments/${treatmentId}`, {
                method: 'DELETE'
            })
    },
    notifications: {
        getAll: () => request('/notifications'),
        getByUser: (userId, role) => request(`/notifications/user/${userId}?role=${role}`),
        create: (notification) => 
            request('/notifications', {
                method: 'POST',
                body: JSON.stringify(notification)
            }),
        markAsRead: (notificationId) => 
            request(`/notifications/${notificationId}/read`, {
                method: 'PUT'
            }),
        markAllAsRead: (userId, role) => 
            request(`/notifications/read-all?userId=${userId}&role=${role}`, {
                method: 'PUT'
            }),
        clear: () => 
            request('/notifications', {
                method: 'DELETE'
            })
    },
    feedAdditives: {
        getAll: () => request('/feed-additives'),
        getByFarmer: (farmerId) => request(`/feed-additives/farmer/${farmerId}`),
        create: (feedAdditive) => 
            request('/feed-additives', {
                method: 'POST',
                body: JSON.stringify(feedAdditive)
            }),
        update: (id, updates) => 
            request(`/feed-additives/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates)
            }),
        delete: (id) => 
            request(`/feed-additives/${id}`, {
                method: 'DELETE'
            })
    }
};
