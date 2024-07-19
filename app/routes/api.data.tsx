import { json, type ActionFunctionArgs } from "@remix-run/node"

export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  return json({
    id,
    url: "https://yamitzky.dev/"
  })
}
