import axios from "axios";
const BASE_URL = "https://localhost:7203/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const requestIntercept = api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedRequestsQueue = [];

const responseIntercept = api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && 
       !originalRequest.url.includes("/auth/login") && !originalRequest.url.includes("/auth/register")) {
      if (originalRequest.url.includes("/auth/RefreshToken")) {
        // Clear tokens if refresh fails
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const expiredToken = localStorage.getItem("accessToken");
          console.log("expiredToken", localStorage.getItem("accessToken"));

          const response = await api.post(
            "/auth/RefreshToken",
            { jwtToken: expiredToken },
            { headers: { "Content-Type": "application/json" } }
          );

          const newAccessToken = response.data.token;
          console.log("Token refreshed:", newAccessToken);
          localStorage.setItem("accessToken", newAccessToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry all queued requests with the new token
          failedRequestsQueue.forEach((req) => req.resolve(newAccessToken));
          failedRequestsQueue = [];
        } catch (refreshError) {
          // Clear queue and redirect on failure
          failedRequestsQueue.forEach((req) => req.reject(refreshError));
          failedRequestsQueue = [];
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
        return api(originalRequest);
      } else {
        // If refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
