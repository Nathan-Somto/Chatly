import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {v4 as uuidv4} from 'uuid'
import { AxiosError } from "axios";
import { mainApi } from "./axios";
import toast from "react-hot-toast";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLastSeen (lastSeen: Date | string | number): ({
  lastSeen : string;
  isOnline: boolean;
}){
  const obj = {
    lastSeen: "",
    isOnline: false
  }
  let seconds = 300 * 1000 // 5 minutes
  const now = new Date().getTime();
  const lastSeenDate = typeof lastSeen === 'string' || typeof lastSeen === 'number' ? new Date(lastSeen) : lastSeen;
  if(!(lastSeenDate instanceof Date) ) return obj;
  const lastSeenTime = lastSeenDate.getTime();
  console.log("")
  const diff = (now - lastSeenTime)
  console.log(diff);
  if(diff  <= seconds){
    obj.lastSeen = 'Online';
    obj.isOnline = true;
    return obj;
  }
  seconds = 60 * 1000 // 1 minute
  if(Math.ceil(diff  / seconds) <= 59) {
    obj.lastSeen = `last seen ${Math.ceil(diff / seconds)} minutes ago`;
    return obj;
  }
  seconds = seconds * 60 // 1 hour
  if(Math.ceil(diff / seconds) <= 23) {
    obj.lastSeen = `last seen ${Math.ceil(diff / seconds)} hours ago`;
    return obj;
  }
  obj.lastSeen = `last seen at ${lastSeenDate.toDateString()}`;
  return obj;
}
export async function findConversation(userId: string){
  // checks the backe
  return new Promise((resolve) => setTimeout(() => resolve(uuidv4()),3000));
}
export async function uploadFile(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await mainApi.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.url;
  } catch (error) {
    toast.error("Failed to upload image!");
    return null;
  }
}
export function displayError( error: unknown, defaultMessage: string = "An error occurred"): string {
let description = defaultMessage;

if (error instanceof AxiosError && error.response?.data.message) {
    description = error.response.data.message;
}
else if (error instanceof Error) {
    description = error.message;
}
else if(typeof error === "string"){
    description = error;
}

  return description

}
export function generateUsername(name: string){
  let digits = '';
  for (let i = 0; i < 3; i++){
    digits += Math.floor(Math.random() * 10).toString()
  }
  return name+digits;
}