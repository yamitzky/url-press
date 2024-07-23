import { Link } from "@nextui-org/link"
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  json
} from "@remix-run/node"
import { useActionData, useFetcher, useLocation } from "@remix-run/react"
import { isValidationErrorResponse, validationError } from "@rvf/remix"
import { useCallback, useEffect, useState } from "react"
import { Alert } from "~/components/Alert"
import { Header } from "~/components/Header"
import { Main } from "~/components/Main"
import { ShortenerForm } from "~/components/ShortenerForm"
import { Database } from "~/lib/database"
import { validator } from "~/lib/form"
import { generateRandomString } from "~/lib/hooks"

export const meta: MetaFunction = () => {
  return [{ title: "URL Press - URL Shortener for Team" }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")

  if (id) {
    try {
      const database = new Database()
      const result = await database.get(id)
      if (result) {
        return json({ id, url: result.url })
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching from DynamoDB:", error)
        return json({ id, url: "", error: error.message }, { status: 500 })
      }
    }
  }

  return json({ id, url: "", error: null })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await validator.validate(await request.formData())
  if (data.error) return validationError(data.error)

  const { id, url } = data.data

  try {
    const database = new Database()
    await database.put({ id, url })
    return json({ id, url, error: null })
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error saving to DynamoDB:", error)
      return json({ id, url, error: error.message }, { status: 500 })
    }
  }
}

function useCurrentData() {
  const [id, setId] = useState("")
  const location = useLocation()
  const currentData = useFetcher<typeof loader>()
  useEffect(() => {
    if (id || typeof window === "undefined") return

    if (location.hash) {
      const id = location.hash.slice(1)
      const formData = new FormData()
      formData.append("id", id)
      currentData.submit(formData)
      setId(id)
    } else {
      const id = generateRandomString(8)
      setId(id)
      window.history.replaceState(null, "", `/#${id}`)
    }
  }, [id, location.hash, currentData])

  return {
    id,
    url: currentData.data?.url || ""
  }
}

export default function Index() {
  const submitData = useActionData<typeof action>()
  const origin = typeof window !== "undefined" ? window.location.origin : ""

  const currentData = useCurrentData()

  const handleSuccess = useCallback(() => {
    if (submitData && !isValidationErrorResponse(submitData)) {
      navigator.clipboard.writeText(`${origin}/${submitData.id}`)
      window.history.replaceState(null, "", `/#${submitData.id}`)
    }
  }, [submitData, origin])

  return (
    <div>
      <Header />
      <Main>
        <ShortenerForm
          key={`${currentData.id}${currentData.url}`}
          defaultValues={currentData}
          onSuccess={handleSuccess}
        />
        {!isValidationErrorResponse(submitData) &&
          submitData &&
          (submitData.error ? (
            <Alert type="error">{submitData.error}</Alert>
          ) : (
            <Alert type="success">
              <p>
                Copied{" "}
                <Link href={`${origin}/${submitData.id}`}>
                  {origin}/{submitData.id}
                </Link>{" "}
                to the clipboard!
              </p>
              <p className="text-sm">
                It will be redirected to{" "}
                <Link href={submitData.url}>{submitData.url}</Link>
              </p>
            </Alert>
          ))}
      </Main>
    </div>
  )
}
