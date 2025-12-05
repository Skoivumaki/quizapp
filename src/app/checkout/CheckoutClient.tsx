"use client";

import { useState, useEffect } from "react";
import "./App.css";
import { useSaveSpotifyUserMutation } from "@/quizApi";

const baseUrl = process.env.NEXT_PUBLIC_API_URI || "http://127.0.0.1:4242";

export default function CheckoutClient({
  accessToken,
}: {
  accessToken: string | null;
}) {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [spotifyId, setSpotifyId] = useState<string | null>(null);

  const [
    saveSpotifyUser,
    { data: saveData, isLoading: saveLoading, error: saveError },
  ] = useSaveSpotifyUserMutation();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (!accessToken) {
      setSuccess(false);
      setMessage("You need to be logged in to make a purchase.");
      return;
    }

    saveSpotifyUser({ accessToken });

    if (query.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled — continue shopping and checkout when you're ready."
      );
    }
  }, [accessToken, saveSpotifyUser]);

  useEffect(() => {
    if (saveData?.user?.spotify_id) {
      setSpotifyId(saveData.user.spotify_id);
    }
  }, [saveData]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      if (!saveData || !saveData.user.spotify_id) {
        setSuccess(false);
        setMessage("Something went wrong.");
      } else {
        setSuccess(true);
        setSessionId(saveData.user.spotify_id);
      }
    }
  }, [saveData]);

  if (!success && message === "") {
    return <ProductDisplay spotifyId={spotifyId} />;
  } else if (success && sessionId !== "") {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
}

const ProductDisplay = ({ spotifyId }: { spotifyId: string | null }) => (
  <section>
    <div className="product">
      <Logo />
      <div className="description">
        <h3>Quiz App Pro</h3>
        <h5>€10.00 / year</h5>
        <h5>For account: {spotifyId}</h5>
      </div>
    </div>
    <form action={`${baseUrl}/create-checkout-session`} method="POST">
      <input type="hidden" name="lookup_key" value="Quiz_App_Pro-1f34ad5" />
      {spotifyId && <input type="hidden" name="spotify_id" value={spotifyId} />}
      <button
        id="checkout-and-portal-button"
        type="submit"
        disabled={!spotifyId}
      >
        Checkout
      </button>
    </form>
  </section>
);

const SuccessDisplay = ({ sessionId }: { sessionId: string }) => (
  <section>
    <div className="product Box-root">
      <Logo />
      <div className="description Box-root">
        <h3>Subscription to Quiz App Pro successful!</h3>
      </div>
    </div>
    <form action={`${baseUrl}/create-portal-session`} method="POST">
      <input type="hidden" name="session_id" value={sessionId} />
      <button id="checkout-and-portal-button" type="submit">
        Manage your billing information
      </button>
    </form>
  </section>
);

const Message = ({ message }: { message: string }) => (
  <section>
    <p>{message}</p>
  </section>
);

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14px"
    height="16px"
    viewBox="0 0 14 16"
  >
    <g stroke="none" fill="#E184DF" fillRule="evenodd">
      <path
        d="M127,50 L126,50 C123.24,50 121,47.76 121,45 
        C121,42.24 123.24,40 126,40 L135,40 L135,56 L133,56 
        L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 
        L127,42 L126,42 C124.34,42 123,43.34 123,45 
        C123,46.66 124.34,48 126,48 L127,48 Z"
        transform="translate(-121 -40)"
      />
    </g>
  </svg>
);
