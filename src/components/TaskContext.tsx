"use client";
import React, { createContext, useState, useEffect } from "react";

interface ITaskContext {
  taskIds: string[];
  storeIdList: (idList: string[], projectId: string) => void;
  getTasksFromLocalStorage: (projectId: string) => string[] | null;
  setTaskIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const TaskContext = createContext<ITaskContext | null>(null);

export const useTaskContext = () => {
  const context = React.useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export const TaskContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [taskIds, setTaskIds] = useState<string[]>([]);

  const storeIdList = (idList: string[], projectId: string) => {
    localStorage.setItem(`taskOrder/${projectId}`, JSON.stringify(idList));
    setTaskIds(idList);
  };

  const getTasksFromLocalStorage = (projectId: string) => {
    const storedOrder = localStorage.getItem(`taskOrder/${projectId}`);
    if (storedOrder) {
      const taskOrder = JSON.parse(storedOrder);
      setTaskIds(taskOrder);
      return taskOrder;
    }
    return null;
  };

  return (
    <TaskContext.Provider
      value={{
        taskIds,
        storeIdList,
        getTasksFromLocalStorage,
        setTaskIds,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
