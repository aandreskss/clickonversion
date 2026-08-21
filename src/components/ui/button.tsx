import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-[#FF5A1F] focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",

          // Variants
          variant === "primary" && [
            "bg-[#FF5A1F] text-white",
            "hover:bg-[#E54A15] active:scale-[0.98]",
          ],
          variant === "secondary" && [
            "bg-white/10 text-white border border-white/15",
            "hover:bg-white/15 active:scale-[0.98]",
          ],
          variant === "ghost" && [
            "text-[#B0B8C1] hover:text-white hover:bg-white/5",
          ],
          variant === "outline" && [
            "border border-[#2A3340] text-[#B0B8C1]",
            "hover:border-white/20 hover:text-white hover:bg-white/5",
          ],
          variant === "danger" && [
            "bg-red-500/10 text-red-400 border border-red-500/20",
            "hover:bg-red-500/20",
          ],

          // Sizes
          size === "sm" && "px-3.5 py-1.5 text-sm",
          size === "md" && "px-5 py-2.5 text-sm",
          size === "lg" && "px-7 py-3.5 text-base",

          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
