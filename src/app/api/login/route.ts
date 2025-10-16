import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const scope = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-read-private",
  ].join(" ");

  const client_id = process.env.SPOTIFY_CLIENT_ID!;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;

  const params = new URLSearchParams({
    response_type: "code",
    client_id,
    scope,
    redirect_uri,
  });

  return Response.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
