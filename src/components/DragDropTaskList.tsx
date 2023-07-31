"use client";
import React, { useState } from "react";
import SingleTask from "./SingleTask";
import { Task } from "@prisma/client";

const DragDropTaskList = ({ tasks }: { tasks: Task[] }) => {
  const [theTasks, setTheTasks] = useState<Task[]>(tasks);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");

    // source: the thing you're dragging.
    // target: the thing you're dragging to.

    // Find the index of the source task and the target task in the tasks array
    const sourceIndex = theTasks.findIndex((task) => task.id === sourceId);
    const targetIndex = theTasks.findIndex((task) => task.id === targetId);

    // Create a new array to hold the updated order of tasks
    const newTasks = [...theTasks];

    // Remove the source task from its original position
    const [sourceTask] = newTasks.splice(sourceIndex, 1);

    // Insert the source task into its new position
    newTasks.splice(targetIndex, 0, sourceTask);

    // Update the state with the new order of tasks
    setTheTasks(newTasks);
  };

  return (
    <div>
      {theTasks.map((task) => (
        <SingleTask task={task} key={task.id} handleDrop={handleDrop} />
      ))}
    </div>
  );
};

export default DragDropTaskList;
