import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const spotifyApi = createApi({
  reducerPath: "spotifyApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/spotify/" }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query<any, void>({
      query: () => "me",
    }),
    getUserPlaylists: builder.query<any, void>({
      query: () => "me/playlists",
    }),
    getTrack: builder.query<any, string>({
      query: (id) => `tracks/${id}`,
    }),
    playPlaylist: builder.mutation<void, string>({
      query: (id) => ({
        url: "me/player/play",
        method: "PUT",
        body: {
          context_uri: `spotify:playlist:${id}`,
        },
      }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetUserPlaylistsQuery,
  useGetTrackQuery,
  usePlayPlaylistMutation,
} = spotifyApi;
