import axios from "axios";

const customFetch = axios.create({
    baseURL: "http://localhost:4000",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    }
})

// إضافة التوكن تلقائياً لكل الطلبات
customFetch.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default customFetch;