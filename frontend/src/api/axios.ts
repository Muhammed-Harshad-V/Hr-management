import axios from "axios";

const API_URL = "http://localhost:3000";

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
