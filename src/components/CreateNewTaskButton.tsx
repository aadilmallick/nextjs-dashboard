"use client";
import React, { useState } from "react";
import Modal from "react-modal";
import Button from "./Button";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Input from "./Input";
import { fetcher } from "@/lib/api";
import { Task } from "@prisma/client";

const selectOptions: { value: Task["status"]; label: string }[] = [
  { value: "COMPLETED", label: "Completed" },
  { value: "STARTED", label: "Started" },
  { value: "NOT_STARTED", label: "Not Started" },
];

interface ICreateNewTaskButtonProps {
  id: string;
}

Modal.setAppElement("#modal");

const CreateNewTaskButton = ({ id }: ICreateNewTaskButtonProps) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const router = useRouter();
  const [taskStatus, setTaskStatus] = useState<Task["status"]>("NOT_STARTED");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // await createNewProject(name);
    const body = await fetcher({
      url: "/api/task",
      method: "POST",
      body: {
        name: taskName,
        description: taskDescription,
        projectId: id,
        status: taskStatus,
      },
      json: true,
    });
    console.log(body);
    closeModal();
    setTaskName("");
    setTaskDescription("");
    setTaskStatus("NOT_STARTED");
    const taskIds = localStorage.getItem(`taskOrder/${id}`);
    console.log("in create task", taskIds);
    if (taskIds) {
      localStorage.setItem(
        `taskOrder/${id}`,
        JSON.stringify([...JSON.parse(taskIds), body.id])
      );
    }
    window.location.reload();
  };

  return (
    <>
      <Button intent="text" className="text-violet-600" onClick={openModal}>
        + Create New
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-1/2 bg-white rounded-xl p-8"
      >
        <h1 className="text-3xl mb-6">New Task</h1>
        <form
          className="flex flex-col items-start justify-center max-w-lg space-y-4"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <Input
            placeholder="task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <Select
            options={selectOptions}
            placeholder="task status"
            defaultValue={selectOptions[2]}
            className="w-full"
            onChange={(e) => setTaskStatus(e!.value)}
          />
          <Button type="submit">Create</Button>
        </form>
      </Modal>
    </>
  );
};

export default CreateNewTaskButton;
