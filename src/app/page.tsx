import Link from "next/link";
import { Button, ButtonTheme, ButtonSize } from "./components/Button";
import { Container } from "./components/Container";
import UserProfile from "./components/UserProfile";
import { cookies } from "next/headers";
import NavBar from "./components/NavBar";
import viewImage from "@/shared/assets/images/view.png";
import Image from "next/image";

export default async function PlayerPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
        }}
      >
        <NavBar />
        <div className="bg-gradient-to-t from-gray-950 via-gray-800 to-gray-950 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-16 mt-5 relative overflow-hidden">
          {/* LEFT TEXT CONTENT */}
          <div className="max-w-lg z-10">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Make your music more fun with Quiz App
            </h1>

            <p className="mt-4 text-gray-300 text-sm md:text-base font-medium">
              Play fast, customizable music‑guessing games with friends or solo
              using your own playlists and favorite songs.
            </p>
          </div>

          {/* RIGHT IMAGE SHOWCASE */}
          <div className="relative mt-12 md:mt-0 md:ml-10 flex items-center justify-center">
            {/* Back Layer 2 (most faded) */}
            <div className="absolute rotate-[14deg] translate-x-6 translate-y-6 opacity-10 scale-95">
              <Image
                src={viewImage}
                alt="App preview background layer"
                width={300}
                className="rounded-2xl"
              />
            </div>

            {/* Back Layer 1 */}
            <div className="absolute rotate-[10deg] translate-x-3 translate-y-3 opacity-20 scale-97">
              <Image
                src={viewImage}
                alt="App preview background layer"
                width={300}
                className="rounded-2xl"
              />
            </div>

            {/* Main Front Image */}
            <div className="relative rotate-[6deg] shadow-2xl shadow-purple-900/40 transition-transform duration-500 hover:rotate-[2deg]">
              <Image
                src={viewImage}
                alt="Quiz App preview"
                width={300}
                className="rounded-2xl border border-gray-800"
                priority
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem",
            gap: "1rem",
          }}
        >
          <Container
            direction="row"
            justify="between"
            align="center"
            gap="4"
            className="w-full p-4 rounded"
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature 1 */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-indigo-400 transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Playlist Powered
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  Turn any Spotify playlist into an interactive guessing game.
                  Use your own playlists or challenge friends with shared mixes.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-purple-400 transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Multiple Game Modes
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  Play classic solo mode or compete in Duo Mode. Customize seek
                  time, shuffle tracks, and adjust difficulty.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-indigo-400 transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Competitive Scoring
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  Track scores in real time and reveal answers with built‑in
                  cooldowns to keep the game fair and exciting.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-purple-400 transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Customizable Experience
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  Adjust track limits, random start positions, and game flow to
                  match your group’s vibe.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-pink-400 transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Built for Friends
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  Perfect for parties, game nights, or remote sessions. Compete,
                  laugh, and discover forgotten favorites.
                </p>
              </div>
            </div>
          </Container>
          <Container
            direction="col"
            justify="center"
            align="center"
            gap="4"
            className="w-full p-8 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-800 shadow-lg"
          >
            <div className="text-center max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ready to Test Your Music Knowledge?
              </h2>

              <p className="text-gray-300 mt-3 mb-3 text-sm md:text-base">
                Start instantly with your Spotify playlists. No setup, no
                downloads — just connect your Spotify and play.
              </p>

              <div className="mt-6 flex flex-col items-center gap-3">
                <Button theme={ButtonTheme.PRIMARY} size={ButtonSize.XL}>
                  <Link href="/play" className="px-6">
                    Play Now
                  </Link>
                </Button>

                <span className="text-xs text-gray-500">
                  Free during beta • No payment required
                </span>
              </div>
            </div>
          </Container>
          <Container
            direction="col"
            justify="center"
            align="center"
            gap="6"
            className="w-full p-10 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-800 shadow-lg"
          >
            <div className="text-center max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quiz App Pro
              </h2>

              <p className="text-gray-400 mt-3 text-sm">
                Unlock unlimited games and premium features for low yearly
                price.
              </p>

              {/* Price */}
              <div className="mt-8">
                <div className="flex items-end justify-center gap-2">
                  <span className="text-5xl font-extrabold text-white">
                    $10
                  </span>
                  <span className="text-gray-400 mb-1">/year</span>
                </div>
              </div>

              {/* Feature List */}
              <div className="mt-8 space-y-3 text-sm text-gray-300">
                <div>✅ Unlimited playlist quizzes</div>
                <div>✅ Multiple gamemodes and highly customizable</div>
                <div>✅ Access to Playlist Mixer</div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <div className="p-[2px] rounded-xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  <Button
                    theme={ButtonTheme.PRIMARY}
                    size={ButtonSize.XL}
                    className="w-full h-9 rounded-xl bg-gray-900 hover:bg-gray-800"
                  >
                    <Link href="/checkout" className="px-6">
                      Get Quiz App Pro
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Secure checkout • Cancel anytime
                </p>
              </div>
            </div>
          </Container>
          <Container
            direction="col"
            justify="between"
            align="center"
            gap="4"
            className="w-full p-4 rounded"
          >
            <h1>{"PROFILE INFO"}</h1>
            <UserProfile accessToken={accessToken} />
          </Container>
        </div>
      </div>
    </>
  );
}
