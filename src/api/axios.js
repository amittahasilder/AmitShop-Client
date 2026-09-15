// import axios from "axios";

// const api = axios.create({
//   baseURL:
//     import.meta.env.VITE_API_URL ||
//     "http://localhost:5000/api",

//   withCredentials: true,

//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL:
//     import.meta.env.VITE_API_URL ||
//     "http://localhost:5000/api",

//   withCredentials: true,
// });

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  withCredentials: true,
});

// Attach access token automatically
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;