import axios from "axios";

const customFetch = axios.create({
  baseURL: "/api",  // ✅ هيمر من الـ proxy
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

customFetch.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // تأكد أن الـ header موجود في كل طلب
  config.headers["ngrok-skip-browser-warning"] = "true";
  return config;
});

export default customFetch;