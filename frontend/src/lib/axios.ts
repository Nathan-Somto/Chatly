import axios from "axios";
  const mainApi = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL
  });
export {
    mainApi
}