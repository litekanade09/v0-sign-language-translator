"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function OutputPanel({
  outputLang,
  captionSize,
  highlightKeywords,
  keywords,
  announce,
}: {
  outputLang: string
  captionSize: "sm" | "md" | "lg"
  highlightKeywords: boolean
  keywords: string[]
  announce: (msg: string) => void
}) {
  const [transcript, setTranscript] = useState<string>("Ready.")
  const [speaking, setSpeaking] = useState(false)
  const areaRef = useRef<HTMLDivElement | null>(null)

  // Mock stream appends text every few seconds when "speaking" is on
  useEffect(() => {
    if (!speaking) return
    const id = setInterval(() => {
      setTranscript((t) => t + " Hello there, how can I help you?")
      announce("New caption added")
    }, 2500)
    return () => clearInterval(id)
  }, [speaking, announce])

  function speakNow() {
    const utter = new SpeechSynthesisUtterance(transcript)
    utter.lang = outputLang === "Hindi" ? "hi-IN" : outputLang === "Marathi" ? "mr-IN" : "en-US"
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  const sizeClass =
    captionSize === "lg"
      ? "text-2xl leading-relaxed"
      : captionSize === "md"
        ? "text-xl leading-relaxed"
        : "text-base leading-relaxed"

  const highlighted = useMemo(() => {
    if (!highlightKeywords) return transcript
    let html = transcript
    keywords.forEach((k) => {
      const re = new RegExp(`\\b(${k})\\b`, "gi")
      html = html.replace(re, '<mark class="bg-accent text-accent-foreground rounded px-1">$1</mark>')
    })
    return html
  }, [transcript, highlightKeywords, keywords])

  return (
    <Card role="region" aria-live="polite" aria-label="Translated output and audio controls" className="flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-pretty">Translated Output · {outputLang}</h2>
        <div className="flex gap-2">
          <Button onClick={() => setSpeaking((s) => !s)} aria-pressed={speaking}>
            {speaking ? "Pause" : "Start"} captions
          </Button>
          <Button variant="secondary" onClick={speakNow}>
            Play audio
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div
          ref={areaRef}
          className={sizeClass + " min-h-40 rounded-md border border-border/60 bg-card/50 p-4"}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>

      <div className="px-4 pb-4 text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-3">
        <figure className="rounded-md border border-border/60 bg-card/50 p-3">
          <figcaption className="mb-2 font-medium">Sign Avatar (preview)</figcaption>
          <img
            src="/animated-signing-avatar-placeholder.jpg"
            alt="Animated avatar placeholder showing sign animation"
            className="h-40 w-full rounded bg-muted object-cover"
          />
        </figure>
        <div className="rounded-md border border-border/60 bg-card/50 p-3">
          <div className="font-medium mb-1">Emotion</div>
          <div className="text-2xl">🙂 Neutral</div>
        </div>
      </div>
    </Card>
  )
}
