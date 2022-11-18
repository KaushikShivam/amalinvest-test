import { StockWithWeight } from "@amalinvest/types";
import React from "react";
import Button from "./Button";
import SearchInput from "./SearchInput";

interface SearchFormProps {
  formValues: StockWithWeight[];
  error?: string;
  addField: () => void;
  removeField: (id: string) => void;
  handleChange: (body: Partial<StockWithWeight>) => void;
  handleSubmit: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  formValues,
  error,
  removeField,
  addField,
  handleChange,
  handleSubmit,
}) => {
  return (
    <>
      <form>
        {formValues.map((option) => {
          return (
            <div className="flex mb-3" key={option.id}>
              <SearchInput
                option={option}
                type="stock"
                handleChange={handleChange}
              />
              <SearchInput
                option={option}
                type="weight"
                handleChange={handleChange}
              />
              <Button
                color="red"
                disabled={formValues.length === 1}
                type="button"
                onClick={() => removeField(option.id)}
              >
                -
              </Button>
            </div>
          );
        })}
        {error && <p className="text-red-400">{error}</p>}
        <div className="flex mt-3">
          <Button
            color="blue"
            type="submit"
            onClick={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            Submit
          </Button>
          <Button
            disabled={formValues.length === 5}
            type="button"
            onClick={addField}
            color="green"
          >
            Add Stock
          </Button>
        </div>
      </form>
    </>
  );
};

export default SearchForm;
