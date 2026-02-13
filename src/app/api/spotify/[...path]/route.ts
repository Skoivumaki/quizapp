import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function handleSpotifyProxy(req: NextRequest) {
  const token = (await cookies()).get("spotify_access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  const path = req.nextUrl.pathname.replace(/^\/api\/spotify\//, "");
  const search = req.nextUrl.search;
  const url = `https://api.spotify.com/v1/${path}${search}`;

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

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const contentType = res.headers.get("content-type") ?? "";
  let data: any = null;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    data = await res.text();
  }

  return NextResponse.json(data ?? {}, { status: res.status });
}

export const GET = handleSpotifyProxy;
export const POST = handleSpotifyProxy;
export const PUT = handleSpotifyProxy;
export const DELETE = handleSpotifyProxy;
