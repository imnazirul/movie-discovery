import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({
  className,
  ...props
}: InputProps) => {
  return (
    <input

      className={cn(
        "bg-transparent outline-none placeholder:text-accent_text_slate",
        className,
      )}

      {...props}
    />
  );
};

export default Input;
