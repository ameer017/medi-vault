import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shareCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function emergencyToken() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "emg_";
  for (let i = 0; i < 22; i += 1) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
