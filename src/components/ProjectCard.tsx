import { Prisma, TASK_STATUS } from "@prisma/client";
import clsx from "clsx";
import React from "react";

const projectWithTasks = Prisma.validator<Prisma.ProjectArgs>()({
  include: { tasks: true },
});

type ProjectWithTasks = Prisma.ProjectGetPayload<typeof projectWithTasks>;

export const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const ProjectCard = ({ project }: { project: ProjectWithTasks }) => {
  const completedCount = project.tasks.filter(
    (t) => t.status === TASK_STATUS.COMPLETED
  ).length;
  const progress = Math.ceil((completedCount / project.tasks.length) * 100);
  return (
    <div className="!px-6 !py-8 hover:scale-105 transition-all ease-in-out duration-200 card">
      <div className="flex justify-between items-center flex-wrap">
        <span className="text-sm text-gray-300">
          {formatDate(project.createdAt)}
        </span>
        <span className="text-sm text-red-300">
          {project.due && formatDate(project.due)}
        </span>
      </div>
      <div className="mb-6">
        <span className="text-3xl text-gray-600">{project.name}</span>
      </div>
      <div className="mb-2">
        <span className="text-gray-400">
          {completedCount}/{project.tasks.length} completed
        </span>
      </div>
      <div>
        <div className="w-full h-2 bg-violet-200 rounded-full mb-2">
          <div
            className={clsx(
              "h-full text-center text-xs text-white bg-violet-600 rounded-full"
            )}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-600 font-semibold">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
