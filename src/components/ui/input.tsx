import { cn } from "@/lib/utils"
import { forwardRef, type InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#B0B8C1]"
          >
            {label}
            {props.required && <span className="text-[#FF5A1F] ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border bg-[#1C2026] text-white placeholder:text-[#546072]",
            "px-3.5 py-2.5 text-sm transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 focus:border-[#FF5A1F]/60",
            error
              ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60"
              : "border-white/10 hover:border-white/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400" role="alert">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#546072]">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Light mode input (for CRM)
export const InputLight = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-[#FF5A1F] ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border bg-white text-slate-900 placeholder:text-slate-400",
            "px-3.5 py-2.5 text-sm transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F]/60",
            error
              ? "border-red-300 focus:ring-red-300/30"
              : "border-slate-200 hover:border-slate-300",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    )
  }
)
InputLight.displayName = "InputLight"
