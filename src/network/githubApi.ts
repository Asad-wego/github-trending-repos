/*
 * Created by Asad on 21 Nov 2024
 */

import axios, { CancelTokenSource } from "axios";

interface FetchRepositoriesResponse {
  items: Repository[];
}

// TODO: Replace with environment-specific URL in production
const BASE_URL = "https://api.github.com/search/repositories";

// Create an Axios instance
const axiosInstance = axios.create();

// Set up Axios interceptors for global error handling, especially for rate limiting
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.error("Rate limit exceeded:", error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export const fetchRepositories = async (
  page: number,
  cancelToken: CancelTokenSource
): Promise<Repository[]> => {
  const TEN_DAYS_AGO = new Date();
  TEN_DAYS_AGO.setDate(TEN_DAYS_AGO.getDate() - 10);
  const dateString = TEN_DAYS_AGO.toISOString().split("T")[0];

  try {
    const response = await axiosInstance.get<FetchRepositoriesResponse>(
      `${BASE_URL}?q=created:>${dateString}&sort=stars&order=desc&page=${page}`,
      {
        cancelToken: cancelToken.token,
      }
    );
    return response.data.items;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
      return []; // Return an empty array if request is canceled
    } else {
      console.error("Error fetching repositories:", error);
      throw error; // Rethrow the error if it's not a cancellation
    }
  }
};
