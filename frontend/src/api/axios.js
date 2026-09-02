import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("access_token");

        const isAuthRequest =
            config.url === "/auth/login/" ||
            config.url === "/auth/register/";

        if (token && !isAuthRequest) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem("refresh_token");

        if (
            error.response?.status !== 401 ||
            !refreshToken ||
            originalRequest?._retry ||
            originalRequest?.url === "/auth/refresh/" ||
            originalRequest?.url === "/auth/login/" ||
            originalRequest?.url === "/auth/register/"
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const response = await api.post("/auth/refresh/", {
                refresh: refreshToken,
            });
            localStorage.setItem("access_token", response.data.access);
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return api(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return Promise.reject(refreshError);
        }
    }
);
    

export default api;