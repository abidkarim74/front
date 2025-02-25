import axios from "axios";

const axiosJWT = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default axiosJWT;