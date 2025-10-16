import { NextRequest, NextResponse } from "next/server";
import { SpotifyTokenResponse } from "@/types/spotify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect("/error");

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
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  const data: SpotifyTokenResponse = await response.json();
  if ("error" in data) return NextResponse.redirect("/error");

  const res = NextResponse.redirect("http://127.0.0.1:3000");

  res.cookies.set("spotify_access_token", data.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: data.expires_in,
    path: "/",
  });

  if (data.refresh_token) {
    res.cookies.set("spotify_refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  }

  return res;
}
