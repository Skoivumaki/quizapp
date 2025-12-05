import { NextRequest, NextResponse } from "next/server";
import { SpotifyTokenResponse } from "@/types/spotify";

async function notifyBackend(accessToken: string) {
  console.log("Notifying backend of new Spotify user...");
  const url =
    (process.env.NEXT_PUBLIC_API_URI || "http://127.0.0.1:4242") +
    "/auth/spotify/profile";
  console.log(`Sending POST request to: ${url}`);
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: accessToken }),
    });
    console.log(response.body);
    console.log(`Backend response status: ${response.status}`);
    const text = await response.text();
    console.log(`Backend response body: ${text}`);
  } catch (error) {
    console.error("Error notifying backend:", error);
  }
}

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

  const expiresAt = Date.now() + data.expires_in * 1000;

  const res = NextResponse.redirect(
    process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000/quiz"
  );
  // domain: `.${process.env.NEXT_PUBLIC_BASE_URL}` ||
  // Set cookies BEFORE notifying backend
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    res.cookies.set("spotify_access_token", data.access_token, {
      domain: ".thshosting.xyz",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: data.expires_in,
      path: "/",
    });
	
	  res.cookies.set("production", process.env.NEXT_PUBLIC_BASE_URL, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: data.expires_in,
      path: "/",
    });
  } else {
    res.cookies.set("spotify_access_token", data.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: data.expires_in,
      path: "/",
    });
  }

  res.cookies.set("spotify_token_expires_at", expiresAt.toString(), {
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

  notifyBackend(data.access_token);

  return res;
}
