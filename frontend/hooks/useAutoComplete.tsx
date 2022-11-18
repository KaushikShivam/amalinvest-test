// Reference: https://paulallies.medium.com/how-to-build-a-react-autocomplete-component-31085bf0c82b
import React, { useRef, useState } from "react";
import { Option } from "../lib/interfaces";

export default function useAutoComplete({
  delay = 500,
  source,
  onChange,
}: {
  delay?: number;
  source: (searchTerm: string) => Promise<Option[]>;
  onChange: (value: Option) => void;
}) {
  const [myTimeout, setMyTimeOut] = useState(setTimeout(() => {}, 0));
  const listRef = useRef<HTMLUListElement>(null);
  const [suggestions, setSuggestions] = useState<Option[]>([]);
  const [isBusy, setBusy] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [textValue, setTextValue] = useState("");

  const deleyInvoke = (cb: () => void) => {
    if (myTimeout) {
      clearTimeout(myTimeout);
    }
    setMyTimeOut(setTimeout(cb, delay));
  };

  const selectOption = (index: number) => {
    if (index > -1) {
      onChange(suggestions[index]);
      setTextValue(suggestions[index].label);
    }
    clearSuggestions();
  };

  const getSuggestions = async (searchTerm: string) => {
    if (searchTerm && source) {
      const options = await source(searchTerm);
      setSuggestions(options);
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const onTextChange = (searchTerm: string) => {
    setBusy(true);
    setTextValue(searchTerm);
    clearSuggestions();
    deleyInvoke(() => {
      getSuggestions(searchTerm);
      setBusy(false);
    });
  };

  return {
    bindOption: {
      onClick: (e: React.MouseEvent<HTMLLIElement>) => {
        let nodes = listRef.current ? Array.from(listRef.current.children) : [];
        const closest = (e.target as HTMLLIElement).closest("li");
        if (closest) selectOption(nodes.indexOf(closest));
      },
    },
    bindInput: {
      value: textValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onTextChange(e.target.value),
    },
    bindOptions: {
      ref: listRef,
    },
    isBusy,
    suggestions,
    selectedIndex,
  };
}
