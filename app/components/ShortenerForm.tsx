import { Form } from "@remix-run/react"
import { useForm } from "@rvf/remix"
import { FormInput, InputPrefix } from "~/components/FormInput"
import { SubmitButton } from "~/components/SubmitButton"
import { validator, type FormData } from "~/lib/form"
import { useOrigin } from "~/lib/hooks"

type Props = {
  defaultValues: FormData
  onSuccess?: () => void
}

export const ShortenerForm: React.FC<Props> = ({
  defaultValues,
  onSuccess
}) => {
  const origin = useOrigin()
  const form = useForm({
    method: "post",
    validator,
    defaultValues,
    onSubmitSuccess() {
      onSuccess?.()
    }
  })

  return (
    <Form {...form.getFormProps()}>
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
    </Form>
  )
}
