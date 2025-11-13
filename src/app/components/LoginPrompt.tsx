"use client";
import React from "react";
import { Button } from "./Button";

export default function LoginPrompt() {
  const handleLogin = () => {
    window.location.href = "/quiz/api/login";
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 animate-fade-in">
      <div className="bg-gray-800 p-8 rounded-xl text-center text-white shadow-lg w-11/12 max-w-md">
        <h2 className="mb-4 text-2xl font-semibold">Spotify Login Required</h2>
        <p className="mb-6 text-gray-300">
          Please log in to continue using the app.
        </p>
        <Button onClick={handleLogin}>{"Log in with Spotify"}</Button>
      </div>
    </div>
  );
}
