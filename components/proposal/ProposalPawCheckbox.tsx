import type { InputHTMLAttributes } from "react";
import { PawPrint } from "lucide-react";

export default function ProposalPawCheckbox({
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <span className={`proposal-paw ${className}`}>
      <input {...props} type="checkbox" />
      <PawPrint aria-hidden="true" />
    </span>
  );
}
