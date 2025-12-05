import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers, TokenProvider } from "./providers";
import { cookies } from "next/dist/server/request/cookies";
import { redirect } from "next/dist/client/components/navigation";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000/quiz";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  applicationName: "Quiz App",
  title: {
    default: "Quiz App",
    template: "%s | Quiz App",
  },
  description:
    "Play fast, customizable music‑guessing games with friends or solo with the power of your playlists and favorite songs. Quiz App is not affiliated with Spotify.",
  keywords: [
    "music quiz",
    "guess the song",
    "music trivia",
    "spotify game",
    "party game",
  ],
  authors: [{ name: "Koivumäki Digital Solutions", url: baseUrl }],
  creator: "Koivumäki Digital Solutions",
  publisher: "Koivumäki Digital Solutions",
  generator: "Next.js",
  category: "Games",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Quiz App — Guess the Song with Friends",
    description:
      "Turn your playlists into a party. Host live lobbies or play solo—powered by Spotify.",
    siteName: "Quiz App",
    images: [
      {
        url: `${baseUrl}/og/quiz-app-og.png`,
        width: 1200,
        height: 630,
        alt: "Quiz App — Music Guessing Game",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz App — Music Guessing Game",
    description:
      "Guess songs, artists and genres integrated with your Spotify.",
    creator: "@yourhandle",
    images: [`${baseUrl}/og/quiz-app-og.png`],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.ico", sizes: "32x32", type: "image/ico" },
      { url: "/icons/favicon-16.ico", sizes: "16x16", type: "image/ico" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.ico", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Quiz App",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
    redirect("/api/refresh");
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        <Providers>
          <TokenProvider accessToken={accessToken}>{children}</TokenProvider>
        </Providers>
      </body>
    </html>
  );
}
