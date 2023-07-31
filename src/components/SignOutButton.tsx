"use client";
import React from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  async function handleSignOut() {
    setLoading(true);
    await fetch("/api/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    console.log("signed out");
    // window.location.href = "/signin";
    setLoading(false);
    router.push("/signin");
  }

  if (loading) return <Button disabled>Signing Out...</Button>;
  return <Button onClick={handleSignOut}>Sign Out</Button>;
};

export default SignOutButton;
