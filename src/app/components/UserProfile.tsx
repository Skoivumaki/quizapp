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
      <div className="flex flex-row gap-2">
        <h1>{data.display_name}</h1>
        <h1 className="bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Quiz App Pro
        </h1>
      </div>
      <p>{data.email}</p>
      <p>{data.id}</p>
    </div>
  );
}
