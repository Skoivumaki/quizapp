import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URI || "http://localhost:4242/",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Should send cookies instead of body
    saveSpotifyUser: builder.mutation<any>({
      query: () => ({
        url: "auth/spotify/save",
        method: "POST",
      }),
    }),
  }),
});

export const { useSaveSpotifyUserMutation } = quizApi;
