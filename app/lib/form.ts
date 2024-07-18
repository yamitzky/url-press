import { withZod } from "@rvf/zod"
import { z } from "zod"

export const formSchema = z.object({
  url: z
    .string()
    .min(1, { message: "URL is required" })
    .url({ message: "The URL is invalid" }),
  id: z.string().min(1, { message: "Custom URL is required" })
})

export type FormData = z.infer<typeof formSchema>
export const validator = withZod(formSchema)
