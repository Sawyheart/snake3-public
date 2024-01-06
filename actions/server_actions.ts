"use server"
import { redirect } from "next/navigation"

export const researchAction = async (formData: FormData) => {
  console.log(formData.get("search"))
  redirect(`/explore?search_result=${formData.get("search")}`)
}