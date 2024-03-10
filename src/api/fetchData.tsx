import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://rickandmortyapi.com/api/",
});

const cache: Map<string, any[]> = new Map();

export const fetchData = async (searchText: string) => {
  try {
    if (cache.has(searchText)) {
      return cache.get(searchText);
    }

    const response = await axiosInstance.get("character", {
      params: { name: searchText },
    });

    const data = response.data.results;
    cache.set(searchText, data);

    return data;
  } catch (error: any) {
    return error.response.data.error;
  }
};
