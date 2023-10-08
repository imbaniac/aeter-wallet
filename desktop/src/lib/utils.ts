import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const truncateEthAddress = (address: string) => {
  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  const match = address.match(truncateRegex);
  if (!match) return address;
  return match[1] + "\u2026" + match[2];
};
