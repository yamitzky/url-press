import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import AWS from "aws-sdk"
import { Alert } from "~/components/Alert"
import { Header } from "~/components/Header"
import { Main } from "~/components/Main"

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_DEFAULT_REGION || "us-east-1"
})
const TABLE_NAME = process.env.DYNAMO_TABLE_NAME || "url-press"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params

  if (!id) {
    return redirect("/")
  }

  const dbParams = {
    TableName: TABLE_NAME,
    Key: { id }
  }

  try {
    const result = await dynamoDb.get(dbParams).promise()
    if (result.Item?.url) {
      return redirect(result.Item.url)
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
