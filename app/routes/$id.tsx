import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Alert } from "~/components/Alert"
import { Header } from "~/components/Header"
import { Main } from "~/components/Main"
import { Database } from "~/lib/database"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params

  if (!id) {
    return redirect("/")
  }

  try {
    const database = new Database()
    const result = await database.get(id)
    if (result) {
      return redirect(result.url)
    }
    return redirect(`/#${id}`)
  } catch (error) {
    console.error("Error fetching from DynamoDB:", error)
    return json(
      { id, url: "", error: (error as Error).message },
      { status: 500 }
    )
  }
}

export default function Redirect() {
  const data = useLoaderData<typeof loader>()
  console.log(data.error)
  if (!data.error) {
    return null
  }

  return (
    <div>
      <Header />
      <Main>
        <Alert type="error">{data.error}</Alert>
      </Main>
    </div>
  )
}
