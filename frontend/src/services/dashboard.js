import api from "../api/axios";

/**
 * Fetch freelancer dashboard metrics and data.
 * GET /api/dashboard/freelancer/
 */
export const getFreelancerDashboard = async () => {
    const response = await api.get("/dashboard/freelancer/");
    return response.data;
};

/**
 * Fetch client dashboard metrics and data.
 * GET /api/dashboard/client/
 */
export const getClientDashboard = async () => {
    const response = await api.get("/dashboard/client/");
    return response.data;
};
