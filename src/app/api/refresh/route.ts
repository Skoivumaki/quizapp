import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("spotify_refresh_token")?.value;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";

    if (!refreshToken) {
      console.error("No refresh token cookie found");
      return NextResponse.redirect(`${baseUrl}/api/login`);
    }

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
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Spotify refresh response not OK:", errorBody);
      return new NextResponse("Failed to refresh token", { status: 500 });
    }

    const data = await response.json();

    const accessToken = data.access_token;
    const expiresIn = data.expires_in;
    const newRefreshToken = data.refresh_token ?? refreshToken;
    const expiresAt = Date.now() + expiresIn * 1000;

    const res = NextResponse.redirect(`${baseUrl}/`);

    res.cookies.set("spotify_access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: expiresIn,
      path: "/",
    });

    res.cookies.set("spotify_token_expires_at", expiresAt.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: expiresIn,
      path: "/",
    });

    res.cookies.set("spotify_refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Unexpected /api/refresh error", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
