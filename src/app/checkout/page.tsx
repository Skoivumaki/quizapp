"use client";
import { useState, useEffect } from "react";
import "./App.css";
import { useSaveSpotifyUserMutation } from "@/quizApi";

const baseUrl = process.env.NEXT_PUBLIC_API_URI || "http://127.0.0.1:3000/";

const ProductDisplay = () => (
  <section>
    <div className="product">
      <Logo />
      <div className="description">
        <h3>Quiz App Pro</h3>
        <h5>€10.00 / year</h5>
      </div>
    </div>
    <form action={`${baseUrl}/create-checkout-session`} method="POST">
      {/* Add a hidden field with the lookup_key of your Price */}
      <input type="hidden" name="lookup_key" value="Quiz_App_Pro-1f34ad5" />
      <button id="checkout-and-portal-button" type="submit">
        Checkout
      </button>
    </form>
  </section>
);

const SuccessDisplay = ({ sessionId }) => {
  return (
    <section>
      <div className="product Box-root">
        <Logo />
        <div className="description Box-root">
          <h3>Subscription to Quiz App Pro successful!</h3>
        </div>
      </div>
      <form action={`${baseUrl}/create-portal-session`} method="POST">
        <input
          type="hidden"
          id="session-id"
          name="session_id"
          value={sessionId}
        />
        <button id="checkout-and-portal-button" type="submit">
          Manage your billing information
        </button>
      </form>
    </section>
  );
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [
    saveSpotifyUser,
    { data: saveData, isLoading: saveLoading, error: saveError },
  ] = useSaveSpotifyUserMutation();

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (!accessToken) {
      setSuccess(false);
      setMessage("You need to be logged in to make a purchase.");
    }

    if (accessToken) {
      saveSpotifyUser({ accessToken });
    }

    if (query.get("success")) {
      setSuccess(true);
      // setSessionId(query.get("session_id"));
      if (!saveData.id) {
        setSuccess(false);
        setMessage("Something went wrong.");
      }
      setSessionId(saveData.id);
    }

    if (query.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [saveData.id, saveSpotifyUser, sessionId]);

  if (!success && message === "") {
    return <ProductDisplay />;
  } else if (success && sessionId !== "") {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
}

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="14px"
    height="16px"
    viewBox="0 0 14 16"
    version="1.1"
  >
    <defs />
    <g id="Flow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="0-Default"
        transform="translate(-121.000000, -40.000000)"
        fill="#E184DF"
      >
        <path
          d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z"
          id="Pilcrow"
        />
      </g>
    </g>
  </svg>
);
