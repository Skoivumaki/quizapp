import SpotifyPlayer from "./components/SpotifyPlayer";
import UserProfile from "./components/UserProfile";
import { cookies } from "next/headers";
import Playlists from "./components/Playlists";
import Link from "next/dist/client/link";

export default async function PlayerPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  return (
    <>
      <SpotifyPlayer access_token={accessToken} />
      <UserProfile />
      <Playlists />
      <Link href="/play">Play</Link>
    </>
  );
}
