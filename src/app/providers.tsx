"use client";

import { Provider } from "react-redux";
import { store } from "@/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

import { createContext, useContext } from "react";

const TokenContext = createContext<string | undefined>(undefined);

export function TokenProvider({
  accessToken,
  children,
}: {
  accessToken?: string;
  children: React.ReactNode;
}) {
  return (
    <TokenContext.Provider value={accessToken}>
      {children}
    </TokenContext.Provider>
  );
}

export function useAccessToken() {
  return useContext(TokenContext);
}