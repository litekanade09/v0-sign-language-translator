"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function VideoPanel({
  signLanguage,
  onStart,
  onStop,
  announce,
}: {
  signLanguage: string
  onStart: () => void
  onStop: () => void
  announce: (msg: string) => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!active) return
    let stream: MediaStream | null = null
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          announce("Camera started")
        }
      } catch {
        announce("Camera permission denied")
      }
    }
    start()
    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [active, announce])

  return (
    <Card className="relative overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-pretty">Live Camera · {signLanguage}</h2>
        <div className="flex gap-2">
          {!active ? (
            <Button
              onClick={() => {
                setActive(true)
                onStart()
              }}
              aria-pressed={active}
            >
              Start
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                setActive(false)
                onStop()
              }}
            >
              Stop
            </Button>
          )}
        </div>
      </div>
      <div className="aspect-video bg-muted">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          playsInline
          muted
          aria-label="Webcam preview"
        />
      </div>
      <div className="p-4 text-sm text-muted-foreground">
        Tip: Ensure your hands are visible with good lighting for better recognition.
      </div>
    </Card>
  )
}
