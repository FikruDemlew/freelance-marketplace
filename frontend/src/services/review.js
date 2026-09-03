import api from "../api/axios";


export const getReviews = async (params = {}) => {
    const response = await api.get("/reviews/", { params });
    return response.data;
};


export const getFreelancerReviews = async (freelancerId) => {
    return getReviews({ freelancer_id: freelancerId });
};


export const createReview = async (reviewData) => {
    const response = await api.post("/reviews/", reviewData);
    return response.data;
};
