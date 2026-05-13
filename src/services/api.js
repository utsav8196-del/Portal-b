// import axios from 'axios';

// // Use environment variable if set, otherwise empty string (relies on Vite proxy)
// const baseURL = import.meta.env.VITE_API_URL || '';

// const api = axios.create({
//   baseURL,
//   withCredentials: true,
// });

// // Optional: Add a request interceptor to log the actual URL being called
// api.interceptors.request.use(request => {
//   console.log('Starting Request:', request.baseURL, request.url);
//   return request;
// });

// export default api;



import axios from 'axios';

const api = axios.create({
  baseURL: '',        // empty → calls go to same origin (Vite will proxy /api)
  withCredentials: true,
});

export default api;