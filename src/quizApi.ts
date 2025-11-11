import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import SearchPlaylist from "./app/components/SearchPlaylist";

export const spotifyApi = createApi({
  reducerPath: "spotifyApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/spotify/" }),
  endpoints: (builder) => ({
    SearchPlaylists: builder.query<
      any,
      { query: string; limit?: number; offset?: number }
    >({
      query: ({ query, limit = 20, offset = 0 }) =>
        `search?q=${encodeURIComponent(
          query
        )}&type=playlist&limit=${limit}&offset=${offset}`,
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => "me",
    }),
    getUserPlaylists: builder.query<
      any,
      { userId?: string; limit?: number; offset?: number }
    >({
      query: ({ userId, limit = 20, offset = 0 }) => {
        const base = userId ? `users/${userId}/playlists` : `me/playlists`;

        return `${base}?limit=${limit}&offset=${offset}`;
      },
    }),
    getTrack: builder.query<any, string>({
      query: (id) => `tracks/${id}`,
    }),
    getPlaylist: builder.query<any, string>({
      query: (id) => `playlists/${id}`,
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
    playTrack: builder.mutation<
      void,
      { id: string; position_ms?: number; device_id?: string }
    >({
      query: ({ id, position_ms, device_id }) => ({
        url: `me/player/play${
          device_id ? `?device_id=${encodeURIComponent(device_id)}` : ""
        }`,
        method: "PUT",
        body: {
          uris: [`spotify:track:${id}`],
          ...(position_ms !== undefined ? { position_ms } : {}),
        },
      }),
    }),
  }),
});

export const {
  useSearchPlaylistsQuery,
  useGetCurrentUserQuery,
  useGetUserPlaylistsQuery,
  useGetTrackQuery,
  useGetPlaylistQuery,
  usePlayPlaylistMutation,
  usePlayTrackMutation,
} = spotifyApi;
