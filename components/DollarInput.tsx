import { Input } from "./ui/input";
import { useRef, useState, useEffect } from "react";

export default function DollarInput({
  field,
  setAmount,
  label,
}: {
  field: any;
  setAmount: React.Dispatch<React.SetStateAction<undefined | string>>;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setAmount(field.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const regex = /^\d*\.?\d{0,2}$/;

    if (regex.test(inputValue) || inputValue === "") {
      field.onChange(e);
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      className="relative inline-block w-full bg-white rounded-sm dark:bg-slate-900"
      onClick={handleContainerClick}
    >
      <div
        className={`relative rounded-sm ${isFocused ? "ring-1 ring-blue-500" : ""}`}
      >
        <div
          className={`border ${isFocused ? "border-blue-500" : "border-gray-600"} rounded-sm h-14 relative transition-colors duration-200`}
        >
          <span
            className={`absolute text-xs cursor-default ${isFocused ? "text-blue-500" : "dark:text-white text-black"} font-light left-3 top-2`}
          >
            {label.toUpperCase()}
          </span>

          <span
            className={`absolute cursor-default dark:text-white text-black font-light left-3 top-[22px] text-md pointer-events-none`}
          >
            $
          </span>

          <Input
            {...field}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={inputRef}
            id="wager"
            type="number"
            name="wager"
            required
            className="absolute bottom-0 focus-visible:ring-0 border-none focus:ring-0 focus:border-none focus:outline-none dark:text-white active:outline-none left-[-7px] w-full h-9 pl-8 pb-2 bg-transparent outline-none text-lg"
          />
        </div>
      </div>
    </div>
  );
}
