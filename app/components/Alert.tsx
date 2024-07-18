import { twMerge } from "tailwind-merge"

type Props = {
  type: "success" | "error"
  className?: string
  children?: React.ReactNode
}

export const Alert: React.FC<Props> = ({ className, children, type }) => {
  return (
    <div
      className={twMerge(
        "border-1 p-4 flex items-center space-x-4",
        type === "success"
          ? "text-success border-success"
          : "text-danger border-danger",
        className
      )}
    >
      <div
        className={twMerge(
          "text-white rounded-full w-6 h-6 text-sm font-bold flex items-center justify-center",
          type === "success" ? "bg-success" : "bg-danger"
        )}
      >
        {type === "success" ? "✓" : "!"}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
