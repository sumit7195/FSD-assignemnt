
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApiResponse } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const modifiedRespnse = (data: ApiResponse[]) => {
  const modifiedData = data.map((item) => ({
    ...item,
    ingredients: item.ingredients.split(","),
  }));
  return modifiedData;
};


