// Desc: Axios configuration file path api/config/axios.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    console.log("Request sent with config:", config);
    return config;
  },
  (error) => {
    // Do something with request error
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    // Do something with response error
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;