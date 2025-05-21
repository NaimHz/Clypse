export const API_BASE_URL = 'https://clypse.onrender.com/v1';

export const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
