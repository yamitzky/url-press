import { Card, CardBody, Link } from "@nextui-org/react"
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction
} from "@remix-run/node"
import { useActionData, useLocation } from "@remix-run/react"
import { isValidationErrorResponse, useForm, validationError } from "@rvf/remix"
import { withZod } from "@rvf/zod"
import { useEffect, useState } from "react"
import { z } from "zod"
import { Alert } from "~/components/Alert"
import { FormInput, InputPrefix } from "~/components/FormInput"
import { Header } from "~/components/Header"
import { SubmitButton } from "~/components/SubmitButton"

const formSchema = z.object({
  url: z
    .string()
    .min(1, { message: "URL is required" })
    .url({ message: "The URL is invalid" }),
  id: z.string().min(1, { message: "Custom URL is required" })
})
type FormData = z.infer<typeof formSchema>
const validator = withZod(formSchema)

export const meta: MetaFunction = () => {
  return [{ title: "URL Press - URL Shortener for Team" }]
}

function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function useRandomID() {
  const [id, setId] = useState<string>("")
  useEffect(() => {
    setId(generateRandomString(10))
  }, [])
  return id
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await validator.validate(await request.formData())
  if (data.error) return validationError(data.error)

  const { id, url } = data.data

  return json({
    id,
    url
  })
}

function useOrigin() {
  const [origin, setOrigin] = useState<string>("")
  useEffect(() => {
    if (typeof window === "undefined") return
    setOrigin(window.location.origin)
  }, [])
  return origin
}

export default function Index() {
  const id = useRandomID()
  const location = useLocation()
  const origin = useOrigin()

  const data = useActionData<typeof action>()
  const form = useForm({
    method: "post",
    validator,
    defaultValues: {
      id: "",
      url: ""
    },
    onSubmitSuccess() {
      if (!isValidationErrorResponse(data) && data?.id) {
        navigator.clipboard.writeText(`${origin}/${data.id}`)
      }
    }
  })

  return (
    <div>
      <Header />
      <form
        {...form.getFormProps()}
        className="h-svh max-w-[640px] space-y-6 mx-auto flex flex-col justify-center"
      >
        <Card className="p-4">
          <CardBody className="space-y-4">
            <div className="flex items-center space-x-4">
              <FormInput
                name="url"
                scope={form.scope("url")}
                isRequired
                label="URL to Shorten"
                description="e.g. https://yamitzky.dev/long-long/path"
              />
              <SubmitButton isDisabled={form.formState.isSubmitting}>
                SHORTEN
              </SubmitButton>
            </div>
            <FormInput
              name="id"
              scope={form.scope("id")}
              label="Custom URL"
              isRequired
              startContent={<InputPrefix>{origin}/</InputPrefix>}
            />
            {!isValidationErrorResponse(data) && data && (
              <Alert type="success">
                <p>
                  Copied{" "}
                  <Link href={`${origin}/${data.id}`}>
                    {origin}/{data.id}
                  </Link>{" "}
                  to the clipboard!
                </p>
                <p className="text-sm">
                  It will be redirected to{" "}
                  <Link href={data.url}>{data.url}</Link>
                </p>
              </Alert>
            )}
          </CardBody>
        </Card>
      </form>
    </div>
  )
}
