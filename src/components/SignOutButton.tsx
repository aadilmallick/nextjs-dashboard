"use client";
import React from "react";
import Button from "./Button";

const SignOutButton = () => {
  async function handleSignOut() {
    await fetch("/api/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    console.log("signed out");
    // window.location.href = "/signin";
  }
  return <Button onClick={handleSignOut}>Sign Out</Button>;
};

export default SignOutButton;
