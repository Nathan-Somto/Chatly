import axios from "axios";
  console.log("the url: ", import.meta.env.VITE_BASE_URL)
  const mainApi = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL
  });
export {
    mainApi
}