"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { fetcher } from "@/lib/api";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditProjectName = ({ project }: { project: Project }) => {
  const [name, setName] = useState(project.name);
  const [startDate, setStartDate] = useState(
    project.due || new Date(Date.now())
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetcher({
      url: `/api/project/${project.id}`,
      method: "PATCH",
      body: {
        name,
        due: startDate,
        id: project.id,
      },
    });
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <label htmlFor="" className="ml-4 font-semibold">
          Change project name
        </label>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="overflow-hidden">
        <label htmlFor="" className="ml-4 font-semibold text-red-400">
          Due on
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date!)}
          className="border border-gray-300 rounded-md p-2 ml-4"
        />
      </div>
      <Button intent="primary" type="submit">
        Save
      </Button>
    </form>
  );
};

export default EditProjectName;
