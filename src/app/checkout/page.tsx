import { cookies } from "next/headers";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value ?? null;

  return <CheckoutClient accessToken={accessToken} />;
}
