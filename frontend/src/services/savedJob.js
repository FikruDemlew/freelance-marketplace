import api from "../api/axios";


export const getSavedJobs = async () => {
    const response = await api.get("/jobs/saved/");
    return response.data;
};


export const saveJob = async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/save/`);
    return response.data;
};


export const removeSavedJob = async (jobId) => {
    await api.delete(`/jobs/${jobId}/save/`);
};
