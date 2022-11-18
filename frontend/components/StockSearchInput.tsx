import { StockWithWeight } from "@amalinvest/types";
import React, { useRef, useState } from "react";
import useAutoComplete from "../hooks/useAutoComplete";
import { getStockNames } from "../lib/api";
import TextInput from "./TextInput";

interface StockSearchInputProps {
  id: string;
  option: StockWithWeight;
  handleChange: (body: Partial<StockWithWeight>) => void;
}

const StockSearchInput: React.FC<StockSearchInputProps> = ({
  id,
  option,
  handleChange,
}) => {
  const {
    bindInput,
    bindOptions,
    bindOption,
    isBusy,
    suggestions,
    selectedIndex,
  } = useAutoComplete({
    onChange: (value) => handleChange({ id: option.id, stock: value.value }),
    source: async (search) => {
      try {
        const data = (await getStockNames(search)).map((i) => ({
          value: i.ticker,
          label: i.name,
        }));
        return data;
      } catch (error) {
        return [];
      }
    },
  });

  return (
    <div className="w-full">
      <div className="relative">
        <TextInput
          value={bindInput.value}
          onChange={bindInput.onChange}
          type="search"
          id={id}
        />
        {isBusy && (
          <div className="absolute top-4 right-10 w-4 h-4 border-2 border-dashed rounded-full border-slate-500 animate-spin"></div>
        )}
      </div>
      {suggestions.length ? (
        <ul
          ref={bindOptions.ref}
          className="w-1/2 bg-white border-2 rounded-lg mt-2 scroll-smooth absolute max-h-80 overflow-x-hidden overflow-y-auto z-50"
        >
          {suggestions.map((_, index) => (
            <li
              className={
                `cursor-pointer flex items-center h-[40px] p-2 hover:bg-blue-100 ` +
                (selectedIndex === index ? `bg-black-300` : "")
              }
              key={index}
              onClick={bindOption.onClick}
            >
              <div className="flex items-center space-x-1">
                <div>{suggestions[index].label}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
};

export default StockSearchInput;
