import axios from "axios";

const api = axios.create({
  baseURL: "https://bk-production-d11b.up.railway.app",
});

export default api;
