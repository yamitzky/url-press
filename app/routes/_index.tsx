import { Card, CardBody, Link } from "@nextui-org/react"
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction
} from "@remix-run/node"
import { useActionData, useLocation } from "@remix-run/react"
import { isValidationErrorResponse, validationError } from "@rvf/remix"
import { Alert } from "~/components/Alert"
import { Header } from "~/components/Header"
import { ShortenerForm } from "~/components/ShortenerForm"
import { validator } from "~/lib/form"
import { useRandomID } from "~/lib/hooks"

export const meta: MetaFunction = () => {
  return [{ title: "URL Press - URL Shortener for Team" }]
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
  const randomId = useRandomID()
  const location = useLocation()

  return (
    <div>
      <Header />
      <div className="h-svh max-w-[640px] space-y-6 mx-auto flex flex-col justify-center">
        <Card className="p-4">
          <CardBody className="space-y-4">
            <ShortenerForm
              defaultValues={{
                id: location.hash ? location.hash.slice(1) : randomId,
                url: ""
              }}
              onSuccess={() =>
                data &&
                !isValidationErrorResponse(data) &&
                navigator.clipboard.writeText(`${origin}/${data.id}`)
              }
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
