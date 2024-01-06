import { twMerge } from "tailwind-merge"
import { clsx, ClassValue } from "clsx"

export const CONTRACT_ADDRESS =  "0xae8f2089bF4e826fD6398161BDE3fc366B9E3d85"  //0xae8f2089bF4e826fD6398161BDE3fc366B9E3d85

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))