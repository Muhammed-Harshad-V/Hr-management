import axios from "axios";

 export const API_URL = "https://gateway-production-bca1.up.railway.app";
 export const S_api = 'attendance-service-production.up.railway.app';

const APIClientPrivate = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true, // Enable cookies
});

export const APIClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Enable cookies
});

export default APIClientPrivate;
