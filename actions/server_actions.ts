"use server"
import { redirect } from "next/navigation"

export const researchAction = async (formData: FormData) => {
  redirect(`/explore?search_result=${formData.get("search")}`)
}