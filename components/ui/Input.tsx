import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  placeholder?: string;
  type: string;
  className?: string;
  value?: string | number;
  required?: boolean;
  name?: string;
  defaultValue?: string;
  min?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({
  placeholder,
  className,
  type,
  defaultValue,
  value,
  name,
  min,
  required = false,
  onChange,
}: InputProps) => {
  return (
    <input
      type={type}
      name={name}
      defaultValue={value === undefined ? defaultValue : undefined} // Use defaultValue only if value is undefined
      value={value} // Use value if provided
      placeholder={placeholder}
      min={min}
      className={cn(
        "bg-transparent outline-none placeholder:text-accent_text_slate",
        className,
      )}
      onChange={onChange}
      required={required}
    />
  );
};

export default Input;
