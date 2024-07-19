import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {v4 as uuidv4} from 'uuid'
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