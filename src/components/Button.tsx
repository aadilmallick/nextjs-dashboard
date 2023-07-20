import React, { ButtonHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { FaGoogle } from "react-icons/fa";

// 1. Create classess for the variants. Here we create two variant props: intent and size
const buttonClasses = cva(
  // first argument: base classes that get applied to all variants
  [
    "rounded-3xl",
    "font-bold",
    "hover:scale-110",
    "active:scale-100",
    "transition",
    "duration-200",
    "ease-in-out",
  ],
  {
    variants: {
      intent: {
        // intent="primary" styling
        primary: [
          "bg-violet-500",
          "text-white",
          "border-transparent",
          "hover:bg-violet-600",
        ],
        // intent="secondary" styling
        secondary: [
          "bg-white",
          "text-black",
          "border-gray-400",
          "hover:bg-gray-100",
          "border-solid",
          "border-2",
          "border-gray-800",
        ],
        // intent="text" styling
        text: ["bg-transparent", "text-black", "hover:bg-gray-100"],
      },
      size: {
        // size="small" styling
        small: ["text-md", "py-1", "px-2"],
        // size="medium" styling
        medium: ["text-lg", "px-6", "py-2"],
        // size="large" styling
        large: ["text-xl", "px-8", "py-4"],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
    },
  }
);

// 2. Create a type interface that extends default button props and the variant props
interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonClasses> {}

const Button = ({
  intent,
  children,
  size,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={buttonClasses({
        intent,
        size,
        className,
      })}
    >
      {children}
    </button>
  );
};

export const GoogleButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      {...props}
      className="flex items-center justify-center w-48 h-12 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none"
    >
      <FaGoogle className="text-red-600 mr-2" />
      <span className="text-gray-700 font-semibold">Login with Google</span>
    </button>
  );
};

export default Button;
