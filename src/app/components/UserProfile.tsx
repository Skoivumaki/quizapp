"use client";
import { useGetCurrentUserQuery } from "@/quizApi";

export default function Profile() {
  const { data, error, isLoading } = useGetCurrentUserQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;

  return (
    <div>
      <h1>{data.display_name}</h1>
      <p>{data.email}</p>
      <p>{data.id}</p>
    </div>
  );
}