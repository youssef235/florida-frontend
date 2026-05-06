import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://embezzle-phoenix-swinging.ngrok-free.dev",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // ⬅️ أضف ده
  },
});

// إضافة التوكن تلقائياً لكل الطلبات
customFetch.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default customFetch;