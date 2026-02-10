import axios from "axios";

const api = axios.create({
  baseURL: "https://real-estate-project-akda.onrender.com/api",
  withCredentials: true,
});

export default api;
