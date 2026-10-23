"use client"

import { useEffect, useRef } from "react"

interface CalInlineEmbedProps {
  calLink: string          // e.g. "username/discovery-15min?metadata[x]=y"
  clientName:  string
  clientEmail: string
  className?:  string
}

declare global {
  interface Window {
    Cal?: (action: string, ...args: unknown[]) => void
  }
}

export function CalInlineEmbed({ calLink, clientName, clientEmail, className }: CalInlineEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized  = useRef(false)

  useEffect(() => {
    if (!containerRef.current || initialized.current) return
    initialized.current = true

    function initEmbed() {
      if (!window.Cal || !containerRef.current) return
      window.Cal("inline", {
        elementOrSelector: containerRef.current,
        calLink,
        config: {
          name:  clientName,
          email: clientEmail,
          theme: "dark",
        },
      })
    }

    if (window.Cal) {
      initEmbed()
      return
    }

    // Load Cal.com embed script once
    const existing = document.getElementById("calcom-embed-script")
    if (!existing) {
      const script = document.createElement("script")
      script.id  = "calcom-embed-script"
      script.src = "https://app.cal.com/embed/embed.js"
      script.async = true
      script.onload = () => {
        // Cal.com's embed.js exposes window.Cal after load
        const poll = setInterval(() => {
          if (window.Cal) {
            clearInterval(poll)
            initEmbed()
          }
        }, 50)
      }
      document.body.appendChild(script)
    } else {
      // Script already in DOM, wait for Cal
      const poll = setInterval(() => {
        if (window.Cal) {
          clearInterval(poll)
          initEmbed()
        }
      }, 50)
    }
  }, [calLink, clientName, clientEmail])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: 600, width: "100%" }}
    />
  )
}
