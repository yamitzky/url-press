import { Button, type ButtonProps } from "@nextui-org/react"

type Props = ButtonProps

export const SubmitButton: React.FC<Props> = ({
  color = "primary",
  type = "submit",
  ...props
}) => {
  return <Button color={color} type={type} {...props} />
}
