import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Universal Spotify proxy route.
 * Calls https://api.spotify.com/v1/<whatever> using the token from cookies.
 * Supports all methods: GET, POST, PUT, DELETE.
 */

async function handleSpotifyProxy(req: NextRequest) {
  const token = (await cookies()).get("spotify_access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  console.log("Proxying Spotify request:", req.method, req.url);

  const path = req.nextUrl.pathname.replace(/^\/api\/spotify\//, "");
  const url = `https://api.spotify.com/v1/${path}`;

  console.log("Forwarding to Spotify API URL:", url);

  const init: RequestInit = {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": req.headers.get("content-type") || "application/json",
    },
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const body = await req.text();
    if (body) init.body = body;
  }

  const res = await fetch(url, init);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export const GET = handleSpotifyProxy;
export const POST = handleSpotifyProxy;
export const PUT = handleSpotifyProxy;
export const DELETE = handleSpotifyProxy;
