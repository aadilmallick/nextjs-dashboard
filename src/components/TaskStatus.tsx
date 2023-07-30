import React, { AllHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Tasks } from "./TaskList";

const textClasses = cva(["font-bold"], {
  variants: {
    type: {
      NOT_STARTED: ["text-red-400"],
      STARTED: ["text-yellow-400"],
      COMPLETED: ["text-green-400"],
    },
  },
  defaultVariants: {
    type: "NOT_STARTED",
  },
});

interface TaskStatusProps
  extends AllHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof textClasses> {
  status: Tasks[0]["status"];
}

const TaskStatus = ({
  type,
  children,
  className,
  status,
  ...props
}: TaskStatusProps) => {
  return (
    <div {...props} className={textClasses({ type: status, className })}>
      {status}
    </div>
  );
};

export default TaskStatus;
