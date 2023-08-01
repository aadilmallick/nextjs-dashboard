import { Prisma, TASK_STATUS } from "@prisma/client";
import { prisma } from "@/lib/db";
import Button from "./Button";
import TaskStatus from "./TaskStatus";
import CreateNewTaskButton from "./CreateNewTaskButton";
import { FaEdit } from "react-icons/fa";
import EditTaskButton from "./EditTaskButton";
import SingleTask from "./SingleTask";
import DragDropTaskList from "./DragDropTaskList";

// TODO: implement state change for task list by passing in setTasks to create task modal

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
    <div className="card relative">
      <div className="flex flex-wrap justify-between items-center pb-2 border-b-2">
        <div className="flex-shrink-0">
          <span className="text-2xl text-gray-600">{title}</span>
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
        <DragDropTaskList tasks={tasks} isProjectView={id ? false : true} />
      ) : (
        <div>no tasks</div>
      )}
    </div>
  );
};

export default TaskList;
