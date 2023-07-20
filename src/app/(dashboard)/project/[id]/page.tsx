import NewProject from "@/components/NewProject";
import TaskList, { Tasks } from "@/components/TaskList";
import { prisma } from "@/lib/db";
import React from "react";

interface Props {
  params: {
    id: string;
  };
}

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { tasks: true },
  });
  return project;
}
const page = async ({ params: { id } }: Props) => {
  const project = await getProject(id);
  return (
    <div>
      <TaskList title={project!.name} tasksDB={project?.tasks as Tasks} />
    </div>
  );
};

export default page;
