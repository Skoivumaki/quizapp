import SpotifyPlayer from "./components/SpotifyPlayer";
import UserProfile from "./components/UserProfile";
import { cookies } from "next/headers";
import Playlists from "./components/Playlists";

export default async function PlayerPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken)
    return <a href="/api/login" className="btn">Login with Spotify</a>;

  return (
    <>
      <SpotifyPlayer access_token={accessToken} />
      <UserProfile />
      <Playlists />
    </>
  );
}