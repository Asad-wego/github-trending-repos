/*
 * Created by Asad on 21 Nov 2024
 */

import React, { useEffect, useReducer, useRef } from "react";
import axios, { CancelTokenSource } from "axios";
import { useTranslation } from "react-i18next";
import { fetchRepositories } from "../network/githubApi";
import { RepoItem } from "../components/molecules";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  INCREMENT_PAGE,
} from "../context/actions";

interface State {
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  page: number;
}

const initialState: State = {
  repositories: [],
  loading: false,
  error: null,
  page: 1,
};

type Action =
  | { type: typeof FETCH_START }
  | { type: typeof FETCH_SUCCESS; payload: Repository[] }
  | { type: typeof FETCH_ERROR; payload: string }
  | { type: typeof INCREMENT_PAGE };

const repoReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case FETCH_START:
      return { ...state, loading: true, error: null };
    case FETCH_SUCCESS:
      const newRepositories = [
        ...state.repositories,
        ...action.payload.filter(
          (repo) => !state.repositories.some((r) => r.id === repo.id)
        ),
      ];
      return {
        ...state,
        loading: false,
        repositories: newRepositories,
      };
    case FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case INCREMENT_PAGE:
      return { ...state, page: state.page + 1 };
    default:
      return state;
  }
};

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(repoReducer, initialState);
  const { loading, repositories, error, page } = state;
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null); // Ref to hold cancel token

  const loadMore = async () => {
    if (loading) return; // Prevent fetching if loading
    dispatch({ type: FETCH_START });

    // Cancel the ongoing request if there is one
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel(t("operation_cancelled_new_request"));
    }

    // Create a new cancel token for the current request
    cancelTokenSourceRef.current = axios.CancelToken.source();

    try {
      const data = await fetchRepositories(page, cancelTokenSourceRef.current);
      dispatch({ type: FETCH_SUCCESS, payload: data });
      dispatch({ type: INCREMENT_PAGE });
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Request was canceled:", error.message);
      } else {
        dispatch({ type: FETCH_ERROR, payload: error.message });
      }
    } finally {
      // Cleanup cancel token after the request completes or errors
      cancelTokenSourceRef.current = null;
    }
  };

  useInfiniteScroll(loadMore);

  useEffect(() => {
    loadMore();
    return () => {
      // Cleanup: cancel any ongoing requests when the component unmounts
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel(t("component_unmounted_message"));
      }
    };
  }, []);

  return (
    <div>
      {repositories.map((repo) => (
        <RepoItem key={repo.id} repo={repo} />
      ))}
      {loading && <div>{t("loading_message")}</div>}
      {error && (
        <div>
          <p>
            {t("error_message")} {error}
          </p>
          <button onClick={loadMore}>{t("retry_button")}</button>
        </div>
      )}
    </div>
  );
};

export default Home;
