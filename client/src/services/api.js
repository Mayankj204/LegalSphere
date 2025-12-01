// client/src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
