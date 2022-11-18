import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="h-14 flex items-center justify-between px-4 text-white bg-red-400">
      {message}
    </div>
  );
};

export default ErrorMessage;
