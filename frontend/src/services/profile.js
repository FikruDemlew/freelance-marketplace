import api from "../api/axios";

/**
 * Fetch the logged-in user's profile.
 * GET /api/auth/profile/
 */
export const getMyProfile = async () => {
    const response = await api.get("/auth/profile/");
    return response.data;
};

/**
 * Update the logged-in user's profile.
 * PATCH /api/auth/profile/
 * Accepts JSON object or FormData instance.
 */
export const updateMyProfile = async (profileData) => {
    const isFormData = profileData instanceof FormData;
    const response = await api.patch("/auth/profile/", profileData, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
};

/**
 * Fetch another user's public profile.
 * GET /api/auth/profiles/:userId/
 */
export const getPublicProfile = async (userId) => {
    const response = await api.get(`/auth/profiles/${userId}/`);
    return response.data;
};
