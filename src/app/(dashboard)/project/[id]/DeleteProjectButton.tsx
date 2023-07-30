"use client";
import Button from "@/components/Button";
import { fetcher } from "@/lib/api";
import { useRouter } from "next/navigation";
import React from "react";

const DeleteProjectButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const onDelete = async () => {
    const okToDelete = confirm("Are you sure you want to delete this project?");
    if (!okToDelete) return;
    //
    await fetcher({
      url: `/api/project/${id}`,
      method: "DELETE",
      body: {
        id,
      },
    });

    router.push("/home");
  };
  return (
    <div className="mt-4 text-center">
      <Button onClick={onDelete}>Delete Project</Button>
    </div>
  );
};

export default DeleteProjectButton;
