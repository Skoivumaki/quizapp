import { NextRequest, NextResponse } from "next/server";
import { SpotifyTokenResponse } from "@/types/spotify";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const refresh_token = cookieStore.get("spotify_refresh_token")?.value;

  if (!refresh_token)
    return new NextResponse("No refresh token", { status: 401 });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  const data: SpotifyTokenResponse = await response.json();

  const res = NextResponse.json(data);

  if (data.access_token) {
    res.cookies.set("spotify_access_token", data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: data.expires_in,
      path: "/",
    });
  }

  return res;
}
