import { StockWithWeight } from "@amalinvest/types";
import React from "react";
import StockSearchInput from "./StockSearchInput";
import TextInput from "./TextInput";

interface SearchInputProps {
  option: StockWithWeight;
  type: "stock" | "weight";
  handleChange: (body: Partial<StockWithWeight>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  option,
  type,
  handleChange,
}) => {
  return (
    <div className="w-1/2 pr-3">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={type}
      >
        {type === "stock" ? "Stock" : `Weight (%)`}
      </label>
      {type === "stock" ? (
        <StockSearchInput option={option} handleChange={handleChange} id={type} />
      ) : (
        <TextInput
          value={option.weight}
          onChange={(event) =>
            handleChange({ id: option.id, weight: event.target.value })
          }
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          id={type}
          type="number"
        />
      )}
    </div>
  );
};

export default SearchInput;
