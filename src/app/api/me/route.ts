import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  console.log("Access Token:", accessToken);
  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  const spotifyRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!spotifyRes.ok) {
    const err = await spotifyRes.json();
    return NextResponse.json(err, { status: spotifyRes.status });
  }

  const data = await spotifyRes.json();
  return NextResponse.json(data);
}
