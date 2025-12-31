import type { Metadata } from "next";
import { cookies } from "next/dist/server/request/cookies";
import LoginPrompt from "../components/LoginPrompt";

export const metadata: Metadata = {
  title: "Guess the Track - Play",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  const expiresAtString = cookieStore.get("spotify_token_expires_at")?.value;

  const now = Date.now();
  const expiresAt = expiresAtString ? Number(expiresAtString) : 0;
  const isExpired = now > expiresAt;

  if (isExpired && accessToken) {
    console.log("REFRESH: Expired token and has accessToken");
  }
  return (
    <>
      {!accessToken && <LoginPrompt />}
      {isExpired && <LoginPrompt />}
      {children}
    </>
  );
}
