import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: string;
}

const Button: React.FC<ButtonProps> = ({
  disabled = false,
  onClick,
  type,
  children,
  color,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`mr-2 leading-tight self-end bg-transparent hover:bg-${color}-500 text-${color}-700 font-semibold hover:text-white py-3 px-4 border border-${color}-500 hover:border-transparent rounded disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

export default Button;
