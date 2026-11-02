// api/axiosPrivate.js
import axios from "axios";

const axiosPrivate = axios.create({
  baseURL: "https://localhost:7203/api",
  withCredentials: true,
});

export default axiosPrivate;
