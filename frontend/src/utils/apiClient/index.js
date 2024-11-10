// apiClient.js
import axios from 'axios';
import loginToken from '../loginToken';
import config from '../config';

// Custom function to handle errors like 401 and 419
const handleError = (error) => {
  const { status } = error.response || {};
  if (status === 401) {
    window.location.href = '/access_denied';
  } else if (status === 419) {
    localStorage.removeItem('UserLoginToken');
    window.location.href = '/authentication_timeout';
  }
  return Promise.reject(error);
};

// Create an Axios instance for authentication-related requests
const authClient = axios.create({
  baseURL: config.REST_AUTH_URL[process.env.REACT_APP_BACKEND], // Update with your auth REST URL
  headers: {
    Authorization: loginToken.current ? `Bearer ${loginToken.current.auth_token}` : '',
  },
});

// Create an Axios instance for general portal requests
const portalClient = axios.create({
  baseURL: `${config.REST_PORTAL_URL[process.env.REACT_APP_BACKEND]}/api`, // Update with your portal REST URL
  headers: {
    Authorization: loginToken.current ? `Bearer ${loginToken.current.auth_token}` : '',
  },
});

// Attach interceptors to handle authorization errors
authClient.interceptors.response.use(response => response, handleError);
portalClient.interceptors.response.use(response => response, handleError);

// Export the clients for use throughout the app
export { authClient, portalClient };
