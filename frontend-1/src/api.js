import axios from "axios"

const api = axios.create({
    baseURL: 'https://carvereels-v2-gaxl.onrender.com/auth'
})

export const googleAuth = (code) => api.get(`/google-login?code=${code}`);
