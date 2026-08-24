import api from '../api/axios';

export const applyForJob = async (jobId, proposal, bidAmount) => {
  const response = await api.post('/applications/', {
    job: jobId,
    proposal,
    bid_amount: bidAmount,
  });
  return response.data;
};

// Add patch request for updating an existing application
export const updateApplication = async (applicationId, proposal, bidAmount) => {
  const response = await api.patch(`/applications/${applicationId}/`, {
    proposal,
    bid_amount: bidAmount,
  });
  return response.data;
};

export const getApplications = async () => {
  const response = await api.get('/applications/');
  return response.data;
};