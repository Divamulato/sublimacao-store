import axios from "axios";

const api = axios.create({
 baseURL: "https://sublimacao-store.onrender.com",
});

export default api;