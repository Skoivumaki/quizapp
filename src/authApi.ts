import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "/quiz/api/spotify/",
  credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // attempt token refresh
    console.log("Attempting token refresh...");
    const refreshResult = await fetch("/quiz/api/spotify/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshResult.ok) {
      // retry original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch({ type: "auth/expired" });
    }
  }

  return result;
};

import { createApi } from "@reduxjs/toolkit/query/react";

export const spotifyApi = createApi({
  reducerPath: "spotifyApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getCurrentUser: builder.query<any, void>({
      query: () => "me",
    }),
  }),
});
