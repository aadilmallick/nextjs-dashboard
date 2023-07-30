import React from "react";
import { Prisma, TASK_STATUS } from "@prisma/client";
import { prisma } from "@/lib/db";
import Button from "./Button";
import TaskStatus from "./TaskStatus";
import CreateNewTaskButton from "./CreateNewTaskButton";
import { FaEdit } from "react-icons/fa";
import EditTaskButton from "./EditTaskButton";

async function getTasks(id: string) {
  const tasks = await prisma.task.findMany({
    where: { ownerId: id, NOT: { status: TASK_STATUS.COMPLETED } },
    take: 5,
    orderBy: {
      due: "asc",
    },
  });
  return tasks;
}

const tasksDB = Prisma.validator<Prisma.TaskArgs>()({
  include: {
    project: true,
    owner: true,
  },
});
export type Tasks = Prisma.TaskGetPayload<typeof tasksDB>[];

const TaskList = async ({
  id,
  title,
  tasksDB,
  projectId,
}: {
  id?: string;
  title: string;
  tasksDB?: Tasks;
  projectId?: string;
}) => {
  const tasks = tasksDB || (id && (await getTasks(id)));
  return (
    <div className="card max-h-[80%] relative overflow-y-auto">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex-shrink-0">
          <span className="text-3xl text-gray-600">{title}</span>
        </div>
        <div>
          {/* if tasks exist, and we are not passing in user id, but instead project tasks */}
          {tasks && tasks.length && !id && (
            <CreateNewTaskButton id={tasks[0].projectId} />
          )}
          {tasks?.length === 0 && projectId && (
            <CreateNewTaskButton id={projectId} />
          )}
        </div>
      </div>
      {tasks && tasks.length ? (
        <div>
          {tasks.map((task) => (
            <div
              className="p-2 hover:bg-gray-200 transition-colors rounded-md cursor-pointer relative group"
              key={task.id}
            >
              <EditTaskButton
                id={task.id}
                description={task.description || ""}
                name={task.name}
                status={task.status}
              />
              <div className="flex flex-wrap justify-between items-center">
                <span className="text-gray-800">{task.name}</span>
                <TaskStatus status={task.status} />
              </div>
              <div>
                <span className="text-gray-400 text-sm">
                  {task.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>no tasks</div>
      )}
    </div>
  );
};

export default TaskList;
