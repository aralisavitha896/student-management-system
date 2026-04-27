import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
});

// Request interceptor: add the access token to headers
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.refreshToken) {
                    const response = await axios.post(`${api.defaults.baseURL}/api/auth/refresh`, {
                        refreshToken: user.refreshToken,
                    });

                    if (response.status === 200) {
                        const { accessToken } = response.data;
                        user.accessToken = accessToken;
                        localStorage.setItem('user', JSON.stringify(user));
                        
                        // Update the header and retry
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Refresh token expired or invalid', refreshError);
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
