import { BASEURL } from "./../Comman/CommanConstans";

// Vite exposes env vars on import.meta.env (not process.env)
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || BASEURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export default API_CONFIG;
