import type { Metadata } from "next";
import { cookies } from "next/dist/server/request/cookies";
import LoginPrompt from "../components/LoginPrompt";

export const metadata: Metadata = {
  title: "Quiz App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  return (
    <>
      {!accessToken && <LoginPrompt />}
      {children}
    </>
  );
}
