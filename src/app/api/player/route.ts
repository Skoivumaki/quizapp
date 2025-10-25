import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_API = "https://api.spotify.com/v1/me/player";

export async function POST(req: NextRequest) {
  const { action, data, access_token, deviceId } = await req.json();
  console.log(
    "Action:",
    action,
    "Device ID:",
    deviceId,
    "Access Token present:",
    !!access_token
  );

  if (!access_token) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  let endpoint = "";
  let method: "PUT" | "POST" | "GET" = "PUT";
  let body: any = undefined;

  // route is only used by the spotify player component. may not even work
  const buildUrl = (base: string, device?: string) => {
    if (device) return `${base}?device_id=${encodeURIComponent(device)}`;
    return base;
  };

  switch (action) {
    case "play":
      endpoint = buildUrl(`${SPOTIFY_API}/play`, deviceId);
      method = "PUT";
      body = data ? JSON.stringify(data) : undefined;
      break;

    case "pause":
      endpoint = buildUrl(`${SPOTIFY_API}/pause`, deviceId);
      method = "PUT";
      break;

    case "next":
      endpoint = buildUrl(`${SPOTIFY_API}/next`, deviceId);
      method = "POST";
      break;

    case "previous":
      endpoint = buildUrl(`${SPOTIFY_API}/previous`, deviceId);
      method = "POST";
      break;

    case "state":
      endpoint = buildUrl(SPOTIFY_API, deviceId);
      method = "GET";
      break;

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const res = await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body,
    });

    let result: any;
    if (res.status === 204) {
      result = { success: true };
    } else {
      const text = await res.text();
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        result = { raw: text };
      }
    }

    return NextResponse.json(result, { status: res.status });
  } catch (err: any) {
    console.error("Spotify /api/player error:", err);
    return NextResponse.json(
      { error: "Spotify player request failed", message: err.message },
      { status: 500 }
    );
  }
}
