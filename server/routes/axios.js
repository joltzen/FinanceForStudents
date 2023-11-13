import axios from "axios";

let baseURL;

if (process.env.NODE_ENV === "production") {
  // Base URL for production
  baseURL = "https://financeforstudents-799d448ab193.herokuapp.com/api";
} else {
  baseURL = "http://localhost:3001/api";
}

const axiosInstance = axios.create({ baseURL });

export default axiosInstance;
