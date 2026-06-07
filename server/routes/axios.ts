/* Copyright (c) 2026, Jason Oltzen */

import axios from "axios";

let baseURL: string;

if (process.env.NODE_ENV === "production") {
  baseURL = "https://financeforstudents-799d448ab193.herokuapp.com/api";
} else {
  baseURL = "http://localhost:3001/api";
}

const axiosInstance = axios.create({ baseURL });

export default axiosInstance;
