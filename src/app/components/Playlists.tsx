"use client";
import { useGetCurrentUserQuery, useGetUserPlaylistsQuery, usePlayPlaylistMutation } from "@/quizApi";

export default function Profile() {
  const { data, error, isLoading } = useGetCurrentUserQuery(); 
  console.log("User ID:", data?.id);
  const { data: playlistsData, error: playlistsError, isLoading: playlistsLoading } = useGetUserPlaylistsQuery(data?.id);
  console.log("User Data:", playlistsData);

  const [playPlaylist] = usePlayPlaylistMutation();

  if (error) return <p>Error loading profile</p>;

  return (
    <div>
      <h1>Playlists</h1>
      {playlistsLoading && <p>Loading playlists...</p>}
      {playlistsError && <p>Error loading playlists</p>}
      {playlistsData && (
        <ul>
          {playlistsData.items.map((playlist) => (
            <li key={playlist.id}>
              {playlist.name}
              {playlist.id}
                    <button onClick={() => playPlaylist(playlist.id)} disabled={isLoading}>
                ▶️ Play
            </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}