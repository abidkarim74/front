import axios from "axios";

const axiosJWT = axios.create({
  baseURL: "https://deploy1-production-8cf4.up.railway.app",
  withCredentials: true,
});

export default axiosJWT;