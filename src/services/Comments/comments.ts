import axiosInstance from '../api';

// Captura o token atualizado para chamadas privadas
const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
});

export const getApprovedComments = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get('/comments/approved', {
    params: { page, limit }
  });
  return response.data;
};

export const createComment = async (data: {
  product_id: number;
  rating: number;
  comment?: string;
}) => {
  const response = await axiosInstance.post('/comments', data, getHeaders());
  return response.data;
};

export const deleteComment = async (id: number | string) => {
  const response = await axiosInstance.delete(`/comments/${id}`, getHeaders());
  return response.data;
};

export const getPendingComments = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get('/comments/pending', {
    params: { page, limit },
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
  });
  return response.data;
};

export const approveOrRejectComment = async (id: number | string, approved: boolean) => {
  const response = await axiosInstance.patch(`/comments/${id}/approval`, { approved }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
  });
  return response.data;
};