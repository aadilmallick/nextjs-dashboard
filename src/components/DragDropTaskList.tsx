"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import SingleTask from "./SingleTask";
import { Task } from "@prisma/client";
import { TaskContextProvider, useTaskContext } from "./TaskContext";

/* 
ONly enable localstorage saving in project view, where all tasks belong to the same project.

useEffect: whenever the tasks array changes, save the new order of tasks to localstorage.
useEffect: on first render, load order from local storage, if it exists, loop through arrays and sort based on ids.

*/

const ClientTaskList = ({
  tasks,
  isProjectView = true,
}: {
  tasks: Task[];
  isProjectView?: boolean;
}) => {
  const [theTasks, setTheTasks] = useState<Task[]>(tasks);
  const projectId = tasks[0].projectId;
  const [loading, setLoading] = useState(true);

  // useLayoutEffect(() => {
  //   if (!isProjectView) return;
  //   // const idList = theTasks.map((task) => task.id);
  //   const storedOrder = localStorage.getItem(`taskOrder/${projectId}`);
  //   if (!storedOrder)
  //   return
  //   const taskOrder = JSON.parse(storedOrder);
  //   console.log("idList", taskOrder);
  //   localStorage.setItem(`taskOrder/${projectId}`, JSON.stringify(taskOrder));
  //   console.log("ran in task add/delete listener");
  // }, [isProjectView, projectId, theTasks.length]);

  useEffect(() => {
    if (!isProjectView) return;
    const storedOrder = localStorage.getItem(`taskOrder/${projectId}`);
    if (storedOrder) {
      const taskOrder = JSON.parse(storedOrder);
      // console.log("taskorder", taskOrder);
      const reorderedTasks = taskOrder.map(
        (taskId: string) => tasks.find((task) => task.id === taskId)!
      );
      setTheTasks(reorderedTasks);
      localStorage.setItem(`taskOrder/${projectId}`, JSON.stringify(taskOrder));
    }
    setLoading(false);
  }, [isProjectView, projectId]);

  // TODO: 1. When you drag and drop a task, update the order of tasks in localstorage. ✅
  // TODO: 2. When you first render, load the order of tasks from localstorage, set as state
  // TODO 3. When you add or delete a task, update the order of tasks in localstorage. DO that in the
  // individual components✅

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

    const idList = newTasks.map((task) => task.id);

    localStorage.setItem(`taskOrder/${projectId}`, JSON.stringify(idList));
    console.log("ran in handleDrop");

    setTheTasks(newTasks);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {theTasks.map((task) => {
        if (!task) {
          return null;
        }
        return <SingleTask task={task} key={task.id} handleDrop={handleDrop} />;
      })}
    </div>
  );
};

const DragDropTaskList = ({
  tasks,
  isProjectView = true,
}: {
  tasks: Task[];
  isProjectView?: boolean;
}) => {
  return <ClientTaskList tasks={tasks} isProjectView={isProjectView} />;
};

export default DragDropTaskList;
