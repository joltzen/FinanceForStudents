import axios from "axios";

let baseURL;

if (process.env.NODE_ENV === "production") {
  // Base URL for production
  baseURL = "/api";
} else {
  // Base URL for development
  baseURL = "http://localhost:3001/api";
}

const axiosInstance = axios.create({ baseURL });

export default axiosInstance;
