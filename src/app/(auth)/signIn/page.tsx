import AuthForm from "@/components/AuthForm";
import Sidebar from "@/components/Sidebar";
import React from "react";

const page = () => {
  return (
    <section>
      <AuthForm mode="signin" />
    </section>
  );
};

export default page;
