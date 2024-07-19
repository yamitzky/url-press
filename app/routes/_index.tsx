import { Card, CardBody, Link } from "@nextui-org/react"
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction
} from "@remix-run/node"
import { useActionData, useFetcher, useLocation } from "@remix-run/react"
import { isValidationErrorResponse, validationError } from "@rvf/remix"
import { useCallback, useEffect, useState } from "react"
import { Alert } from "~/components/Alert"
import { Header } from "~/components/Header"
import { ShortenerForm } from "~/components/ShortenerForm"
import { validator } from "~/lib/form"
import { generateRandomString } from "~/lib/hooks"

export const meta: MetaFunction = () => {
  return [{ title: "URL Press - URL Shortener for Team" }]
}

export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  return json({
    id,
    url: "https://yamitzky.dev/"
  })
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

export default function Index() {
  const data = useActionData<typeof action>()
  const location = useLocation()
  const fetcher = useFetcher<typeof loader>()

  const handleSuccess = useCallback(() => {
    if (data && !isValidationErrorResponse(data)) {
      navigator.clipboard.writeText(`${origin}/${data.id}`)
      window.history.replaceState(null, "", `/#${data.id}`)
    }
  }, [data])

  const [id, setId] = useState("")
  useEffect(() => {
    if (id || typeof window === "undefined") return

    if (location.hash) {
      const id = location.hash.slice(1)
      const formData = new FormData()
      formData.append("id", id)
      fetcher.submit(formData)
      setId(id)
    } else {
      const id = generateRandomString(8)
      setId(id)
      window.history.replaceState(null, "", `/#${id}`)
    }
  }, [id, location.hash, fetcher])
  const url = fetcher.data?.url || ""

  return (
    <div>
      <Header />
      <div className="h-svh max-w-[640px] space-y-6 mx-auto flex flex-col justify-center">
        <Card className="p-4">
          <CardBody className="space-y-4">
            <ShortenerForm
              key={`${id}${url}`}
              defaultValues={{
                id,
                url
              }}
              onSuccess={handleSuccess}
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
      </div>
    </div>
  )
}
