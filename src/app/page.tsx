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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#121212",
          minHeight: "100vh",
          padding: "1rem",
          gap: "1rem",
        }}
      >
        <h1 className="text-center font-bold text-lg">Quiz App prototype</h1>
        <Container
          direction="row"
          justify="between"
          align="center"
          gap="4"
          className="w-full bg-gray-800 p-4 rounded"
        >
          SHOWCASE INFO
        </Container>
        <Container
          direction="col"
          justify="between"
          align="center"
          gap="4"
          className="w-full bg-gray-800 p-4 rounded"
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
          className="w-full bg-gray-800 p-4 rounded"
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
          className="w-full bg-gray-800 p-4 rounded"
        >
          <h1>{"PROFILE INFO"}</h1>
          <UserProfile />
        </Container>
      </div>
    </>
  );
}
