import {ChangeEvent, useState} from "react";

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);
  return {
    value,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
  }
}