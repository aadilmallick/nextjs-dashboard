import React from "react";
import { Prisma, TASK_STATUS } from "@prisma/client";
import { prisma } from "@/lib/db";
import Button from "./Button";

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
}: {
  id?: string;
  title: string;
  tasksDB?: Tasks;
}) => {
  const tasks = tasksDB || (id && (await getTasks(id)));
  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-3xl text-gray-600">{title}</span>
        </div>
        <div>
          <Button intent="text" className="text-violet-600">
            + Create New
          </Button>
        </div>
      </div>
      {tasks && tasks.length ? (
        <div>
          {tasks.map((task) => (
            <div className="py-2" key={task.id}>
              <div>
                <span className="text-gray-800">{task.name}</span>
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
