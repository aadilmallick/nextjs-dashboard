import React from "react";
import Button from "./Button";
import { IUser } from "@/lib/auth";

const Greetings = ({ user }: { user: IUser }) => {
  return (
    <div className="w-full py-4 relative card">
      <div className="mb-4">
        <h1 className="text-3xl text-gray-700 font-bold mb-4">
          Hello, {user.firstName}!
        </h1>
        <h4 className="text-xl text-gray-400">
          Check your daily tasks and schedule
        </h4>
      </div>
      <div>
        <Button size="large">Todays Schedule</Button>
      </div>
    </div>
  );
};

export default Greetings;
