// import axios from "axios"

// const axiosClient =  axios.create({
//     baseURL: 'http://localhost:3000',
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });


// export default axiosClient;

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000', // Adjust according to your backend
  withCredentials: true, // If you're using cookies
});

// Request interceptor to add auth token if available
axiosClient.interceptors.request.use(
  (config) => {
    // You can add tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Return only serializable error data
    const serializableError = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    };
    return Promise.reject(serializableError);
  }
);

export default axiosClient;
