import axios from "axios";

 export const API_URL = "http://gateway:3000";
 export const S_api = 'http://attendance-service:3002';

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
