import { useForm } from "@rvf/remix"
import { useEffect, useState } from "react"
import { FormInput, InputPrefix } from "~/components/FormInput"
import { SubmitButton } from "~/components/SubmitButton"
import { validator, type FormData } from "~/lib/form"

type Props = {
  defaultValues: FormData
}

export const ShortenerForm: React.FC<Props> = ({ defaultValues }) => {
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const form = useForm({
    method: "post",
    validator,
    defaultValues
  })

  return (
    <form {...form.getFormProps()}>
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
    </form>
  )
}
