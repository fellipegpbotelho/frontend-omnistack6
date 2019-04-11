import axios from "axios";

const api = axios.create({
  baseURL: "https://omni-stack-backend.herokuapp.com"
});

export default api;
