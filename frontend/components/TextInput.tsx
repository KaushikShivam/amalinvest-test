import React from "react";

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  id,
  value,
  onChange,
  type
}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
      id={id}
      type={type}
    />
  );
};

export default TextInput;
