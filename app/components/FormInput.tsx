import { Input, type InputProps } from "@nextui-org/react"
import { useField, type FormScope } from "@rvf/remix"
import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"

type Props = InputProps & {
  scope: FormScope<string>
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ scope, variant = "underlined", ...props }, ref) => {
    const field = useField(scope)
    const { value, ...inputProps } = field.getInputProps(props)
    return (
      <Input
        variant={variant}
        errorMessage={field.error()}
        isInvalid={!!field.error()}
        {...inputProps}
        value={value as string}
        ref={ref}
      />
    )
  }
)

export const InputPrefix = ({
  children,
  className
}: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={twMerge("pointer-events-none flex items-center", className)}
    >
      <span className="text-default-400 text-small">{children}</span>
    </div>
  )
}
