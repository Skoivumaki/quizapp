import Link from "next/link";
import { Button, ButtonTheme, ButtonSize } from "./components/Button";
import { Container } from "./components/Container";
import UserProfile from "./components/UserProfile";
import { cookies } from "next/headers";

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
        <div className="flex flex-row fixed w-full top-0 bg-gray-950 text-center justify-between items-center h-10">
          <div className="p-2 text-center justify-between items-center flex flex-row fixed w-full bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            <span>menu</span>
            <h1 className="font-bold text-lg">Quiz App</h1>
            <span>profile</span>
          </div>
        </div>
        <div className="bg-gradient-to-t from-gray-950 via-gray-700 to-gray-950 flex flex-col p-4 h-68 justify-center mt-5">
          <h1 className="w-55 text-left font-bold text-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Make your music more fun with Quiz App
          </h1>
          <p className="w-70 text-left font-semibold text-sm text-white-300">
            Play fast, customizable music‑guessing games with friends or solo
            with the power of your playlists and favorite songs.
          </p>
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
            SHOWCASE INFO
          </Container>
          <Container
            direction="col"
            justify="between"
            align="center"
            gap="4"
            className="w-full p-4 rounded"
          >
            <h1>{"Try for free (testers proceed here)"}</h1>
            <Button theme={ButtonTheme.PRIMARY} size={ButtonSize.XL}>
              <Link href="/play">Play</Link>
            </Button>
          </Container>
          <Container
            direction="col"
            justify="between"
            align="center"
            gap="4"
            className="w-full p-4 rounded"
          >
            <h1>{"BILLING INFO"}</h1>
            <Button theme={ButtonTheme.PRIMARY} size={ButtonSize.XL}>
              <Link href="/checkout">Checkout Page Test</Link>
            </Button>
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
          <Container
            direction="col"
            justify="between"
            align="center"
            gap="4"
            className="w-full p-4 rounded"
          >
            <h1>{"FILLER"}</h1>
          </Container>
          <Container
            direction="col"
            justify="between"
            align="center"
            gap="4"
            className="w-full p-4 rounded"
          >
            <h1>{"FILLER"}</h1>
          </Container>
          <Container
            direction="col"
            justify="between"
            align="center"
            gap="4"
            className="w-full p-4 rounded"
          >
            <h1>{"FILLER"}</h1>
          </Container>
          <Container
            direction="col"
            justify="between"
            align="center"
            gap="4"
            className="w-full p-4 rounded"
          >
            <h1>{"FILLER"}</h1>
          </Container>
        </div>
      </div>
    </>
  );
}
