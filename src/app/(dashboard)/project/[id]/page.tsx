import NewProject from "@/components/NewProject";
import TaskList, { Tasks } from "@/components/TaskList";
import { prisma } from "@/lib/db";
import React from "react";
import DeleteProjectButton from "./DeleteProjectButton";
import EditProjectName from "./EditProjectName";
import { formatDate } from "@/components/ProjectCard";
import { notFound } from "next/navigation";
import { Project, Task } from "@prisma/client";

export const revalidate = 0;

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
  if (!project) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-16">
      <div>
        <TaskList
          title={project!.name}
          tasksDB={project?.tasks as Tasks}
          projectId={id}
        />
        <DeleteProjectButton id={id} />
      </div>
      <div>
        <div className="card">
          <h1 className="text-3xl font-bold mb-4">Edit Project</h1>
          <span className="text-sm block mb-8">
            Created: {formatDate(project.createdAt)}
          </span>
          <EditProjectName project={project!} />
          <div className="border-gray-200 border-t-2 my-4"></div>
          {project.tasks.length > 0 && <Stats tasks={project.tasks} />}
        </div>
      </div>
    </div>
  );
};

const Stats = ({ tasks }: { tasks: Task[] }) => {
  return (
    <ul>
      <li>
        Completed tasks: {tasks.filter((t) => t.status === "COMPLETED").length}
      </li>
      <li>
        In progress tasks: {tasks.filter((t) => t.status === "STARTED").length}
      </li>
      <li>
        Not started tasks:{" "}
        {tasks.filter((t) => t.status === "NOT_STARTED").length}
      </li>
    </ul>
  );
};

export default page;
