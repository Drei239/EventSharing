import axios from "axios";

const customFetch = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

customFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.data.tokenExpires === true) {
      const resp = await customFetch.get("/users/refresh");
      return customFetch(error.config);
    }

    return Promise.reject(error);
  }
);

export default customFetch;
