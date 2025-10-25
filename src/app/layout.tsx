import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers, TokenProvider } from "./providers";
import { cookies } from "next/dist/server/request/cookies";
import { redirect } from "next/dist/client/components/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Quiz App using Next.js and Spotify API",
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

  if (!accessToken || isExpired) {
    redirect("/api/refresh");
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <TokenProvider accessToken={accessToken}>{children}</TokenProvider>
        </Providers>
      </body>
    </html>
  );
}
