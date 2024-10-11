import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// conversion for compare e.g 22:15 = 22.15
export function timeToInt(time: string) {
  return (
      parseFloat(time.replace(":", "."))
  )
}