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
import { FaEdit } from "react-icons/fa";

interface IEditTaskButtonProps {
  id: string;
  name: string;
  status: Task["status"];
  description: string;
}

Modal.setAppElement("#modal");

const EditTaskButton = ({
  id,
  description,
  name,
  status,
}: IEditTaskButtonProps) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [taskName, setTaskName] = useState(name);
  const [taskDescription, setTaskDescription] = useState(description);
  const router = useRouter();
  const [taskStatus, setTaskStatus] = useState<Task["status"]>(status);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // await createNewProject(name);
    await fetcher({
      url: `/api/task/${id}`,
      method: "PATCH",
      body: {
        id,
        description: taskDescription,
        name: taskName,
        status: taskStatus,
      },
    });
    closeModal();
    window.location.reload();
  };

  async function deleteTask() {
    const ifDelete = confirm("Are you sure you want to delete this task?");
    if (!ifDelete) return;

    await fetcher({
      url: `/api/task/${id}`,
      method: "DELETE",
      body: {
        id,
      },
    });

    window.location.reload();
  }

  return (
    <>
      <div
        className="absolute inset-0 flex justify-center items-center opacity-0 transition-opacity group-hover:opacity-100"
        onClick={openModal}
      >
        <FaEdit className="text-blue-400" size={30} />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-1/2 bg-white rounded-xl p-8 relative"
      >
        <h1 className="text-3xl mb-6">Edit Task</h1>
        <Button
          intent={"secondary"}
          size="small"
          className="absolute top-4 right-4 text-red-400 border-red-400"
          onClick={deleteTask}
        >
          delete task
        </Button>
        <form
          className="flex flex-col items-start justify-center max-w-lg space-y-4"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <textarea
            placeholder="task description"
            value={taskDescription}
            className="w-full h-48 border border-gray-200 p-2"
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <Select
            options={selectOptions}
            placeholder="task status"
            defaultValue={selectOptions.filter(
              (option) => option.value === status
            )}
            className="w-full"
            onChange={(e) => setTaskStatus(e!.value)}
          />
          <Button type="submit">Edit</Button>
        </form>
      </Modal>
    </>
  );
};

export default EditTaskButton;
