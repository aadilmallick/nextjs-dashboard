"use client";
import { Task } from "@prisma/client";
import React, { useEffect } from "react";
import Select from "react-select";
import DragDropTaskList from "./DragDropTaskList";
import SingleTask from "./SingleTask";

const DailyTaskList = ({ tasks }: { tasks: Task[] }) => {
  const [selectedTasks, setSelectedTasks] = React.useState<Task[]>([]);

  // console.log(selectedTasks);

  useEffect(() => {
    const storedTasks = localStorage.getItem("dailyTasks");
    if (storedTasks) {
      const taskIds = JSON.parse(storedTasks);
      const tasksD = taskIds.map((id: string) =>
        tasks.find((task: Task) => task.id === id)
      );
      setSelectedTasks(tasksD);
    }
  }, [tasks]);

  const getSelectedTasks = () => {
    const theTasks = selectedTasks.map((task) => {
      if (!task) {
        console.log("task is null selected tasks");
        return null;
      }
      return {
        value: task,
        label: task.name,
      };
    });

    return theTasks.filter((task) => task !== null);
    // TODO: possibly set local storage here as well
  };

  return (
    <div className="card">
      <div className="flex gap-8 items-center">
        <h3 className="text-2xl">Todays Todos</h3>
        <Select
          options={tasks.map((task) => {
            if (!task) {
              console.log("task is null");
            }
            return {
              value: task,
              label: task.name,
            };
          })}
          menuPlacement="top"
          placeholder="tasks"
          isMulti
          isSearchable
          value={getSelectedTasks()}
          className="flex-1"
          onChange={(e) => {
            // console.log(e);
            setSelectedTasks(e.map((task) => task!.value));
            localStorage.setItem(
              "dailyTasks",
              JSON.stringify(e.map((task) => task!.value.id))
            );
          }}
        />
      </div>
      <div>
        {/* {selectedTasks.length > 0 && (
          <DragDropTaskList tasks={selectedTasks} isProjectView={false} />
        )} */}
        {selectedTasks.map(
          (task) => task && <SingleTask task={task} key={task.id} />
        )}
      </div>
    </div>
  );
};

export default DailyTaskList;
