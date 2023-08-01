import NewProject from "@/components/NewProject";
import TaskList, { Tasks } from "@/components/TaskList";
import { prisma } from "@/lib/db";
import React, { Suspense } from "react";
import DeleteProjectButton from "./DeleteProjectButton";
import EditProjectName from "./EditProjectName";
import { formatDate } from "@/components/ProjectCard";
import { notFound } from "next/navigation";
import { Project, Task } from "@prisma/client";
import { Metadata } from "next";
import GreetingsSkeleton from "@/components/GreetingsSkeleton";

export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}

type MetaDataProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const project = await getProject(id);
  return {
    title: `My Dashboard | ${project?.name}` || "Project not found",
    icons: ["./favicon.ico"],
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
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-12 h-full">
      <div className="h-full flex flex-col overflow-y-auto">
        <Suspense fallback={<GreetingsSkeleton />}>
          <TaskList
            title={project!.name}
            tasksDB={project?.tasks as Tasks}
            projectId={id}
          />
        </Suspense>
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
