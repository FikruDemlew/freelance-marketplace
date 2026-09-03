import api from "../api/axios";


export const getApplications = async () => {
    const response = await api.get("/applications/");
    return response.data;
};


export const getApplication = async (id) => {
    const response = await api.get(`/applications/${id}/`);
    return response.data;
};


export const createApplication = async (applicationData) => {
    const response = await api.post(
        "/applications/",
        applicationData
    );

    return response.data;
};


export const updateApplication = async (id, applicationData) => {
    const response = await api.patch(
        `/applications/${id}/`,
        applicationData
    );

    return response.data;
};


export const updateApplicationStatus = async (id, status) => {
    return updateApplication(id, { status });
};


export const deleteApplication = async (id) => {
    const response = await api.delete(
        `/applications/${id}/`
    );

    return response.data;
};