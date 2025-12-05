"use client";

import { useState, useEffect } from "react";

export function useCookies() {
  const [cookies, setCookies] = useState({});

  useEffect(() => {
    if (typeof document === "undefined") return;

    const cookieString = document.cookie;
    const parsed: { [key: string]: string } = {};

    cookieString.split(";").forEach((cookie) => {
      const [key, value] = cookie.split("=").map((c) => c.trim());
      if (key) parsed[key] = decodeURIComponent(value);
    });

    setCookies(parsed);
  }, []);

  return cookies;
}
