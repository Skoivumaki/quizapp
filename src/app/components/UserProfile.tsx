"use client";
import { useGetCurrentUserQuery } from "@/quizApi";
import Link from "next/link";
import { Button, ButtonTheme, ButtonSize } from "./Button";
import { SwitchBox } from "./SwitchBox";

export default function Profile() {
  const { data, error, isLoading } = useGetCurrentUserQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>User is not logged in</p>;

  return (
    <div>
      <h1>{data.display_name}</h1>
      <p>{data.email}</p>
      <p>{data.id}</p>
    </div>
  );
}
