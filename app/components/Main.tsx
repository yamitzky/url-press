import { Card, CardBody } from "@nextui-org/card"

export const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen max-w-[640px] space-y-6 mx-auto flex flex-col justify-center">
      <Card className="p-4">
        <CardBody className="space-y-4">{children}</CardBody>
      </Card>
    </main>
  )
}
