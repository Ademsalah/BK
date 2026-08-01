import axios from "axios";

const api = axios.create({
  baseURL: "https://bk-production-0584.up.railway.app",
});

export default api;
