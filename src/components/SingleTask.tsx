"use client";
import React from "react";
import EditTaskButton from "./EditTaskButton";
import TaskStatus from "./TaskStatus";
import { Task } from "@prisma/client";

type HandleDrop = (
  e: React.DragEvent<HTMLDivElement>,
  targetId: string
) => void;

const SingleTask = ({
  task,
  handleDrop,
}: {
  task: Task;
  handleDrop: HandleDrop;
}) => {
  return (
    <div
      className="p-2 hover:bg-gray-200 transition-colors rounded-md cursor-pointer relative group"
      key={task.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        handleDrop(e, task.id);
      }}
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
        <span className="text-gray-400 text-sm line-clamp-3">
          {task.description}
        </span>
      </div>
    </div>
  );
};

export default SingleTask;
