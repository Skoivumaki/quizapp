import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_API = "https://api.spotify.com/v1/me/player";

export async function POST(req: NextRequest) {
  const { action, data, access_token } = await req.json();
  console.log("Action:", action, "Data:", data, "Access Token:", access_token);

  if (!access_token)
    return NextResponse.json({ error: "No access token" }, { status: 401 });

  let endpoint = "";
  let method: "PUT" | "POST" | "GET" = "PUT";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any = undefined;

  switch (action) {
    case "play":
      endpoint = `${SPOTIFY_API}/play`;
      method = "PUT";
      body = data ? JSON.stringify(data) : undefined;
      break;

    case "pause":
      endpoint = `${SPOTIFY_API}/pause`;
      method = "PUT";
      break;

    case "next":
      endpoint = `${SPOTIFY_API}/next`;
      method = "POST";
      break;

    case "previous":
      endpoint = `${SPOTIFY_API}/previous`;
      method = "POST";
      break;

    case "state":
      endpoint = SPOTIFY_API;
      method = "GET";
      break;

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const res = await fetch(endpoint, {
    method,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body,
  });

  const result = method === "GET" ? await res.json() : { success: res.ok };
  return NextResponse.json(result);
}
