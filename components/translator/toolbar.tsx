"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useEffect } from "react"

type Props = {
  mode: "split" | "conversation"
  onModeChange: (m: "split" | "conversation") => void
  inputSignLang: string
  onChangeInputSignLang: (s: string) => void
  outputLang: string
  onChangeOutputLang: (s: string) => void
  captionSize: "sm" | "md" | "lg"
  onCaptionSize: (s: "sm" | "md" | "lg") => void
  narration: boolean
  onNarration: (b: boolean) => void
  vibrate: boolean
  onVibrate: (b: boolean) => void
  highlightKeywords: boolean
  onHighlightKeywords: (b: boolean) => void
  onStartTranslate: () => void
  onStopTranslate: () => void
}

export function Toolbar(props: Props) {
  const {
    mode,
    onModeChange,
    inputSignLang,
    onChangeInputSignLang,
    outputLang,
    onChangeOutputLang,
    captionSize,
    onCaptionSize,
    narration,
    onNarration,
    vibrate,
    onVibrate,
    highlightKeywords,
    onHighlightKeywords,
    onStartTranslate,
    onStopTranslate,
  } = props

  // Voice guidance when toolbar mounts
  useEffect(() => {
    if (narration) {
      const utter = new SpeechSynthesisUtterance("Toolbar loaded. Use language selectors and start translation.")
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utter)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <header className="flex flex-col gap-3 border-b border-border/60 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={mode === "split" ? "default" : "secondary"}
          onClick={() => onModeChange("split")}
          aria-pressed={mode === "split"}
        >
          Split
        </Button>
        <Button
          variant={mode === "conversation" ? "default" : "secondary"}
          onClick={() => onModeChange("conversation")}
          aria-pressed={mode === "conversation"}
        >
          Conversation
        </Button>

        <Select value={inputSignLang} onValueChange={onChangeInputSignLang}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Input Sign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASL">ASL</SelectItem>
            <SelectItem value="BSL">BSL</SelectItem>
            <SelectItem value="ISL">ISL</SelectItem>
            <SelectItem value="ISL-India">ISL (India)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={outputLang} onValueChange={onChangeOutputLang}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Output Lang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Hindi">Hindi</SelectItem>
            <SelectItem value="Marathi">Marathi</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onStartTranslate} className="bg-primary text-primary-foreground hover:opacity-90">
          ✋ Sign → Text/Speech
        </Button>
        <Button variant="secondary" onClick={onStartTranslate} aria-label="Speech to Sign">
          🎤 Speech → Sign
        </Button>
        <Button variant="ghost" onClick={onStopTranslate} aria-label="Stop translation">
          Stop
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" aria-label="Open settings">
              Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onNarration(!narration)} aria-checked={narration} role="menuitemcheckbox">
              Voice narration {narration ? "On" : "Off"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onVibrate(!vibrate)} aria-checked={vibrate} role="menuitemcheckbox">
              Haptic feedback {vibrate ? "On" : "Off"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onHighlightKeywords(!highlightKeywords)}
              aria-checked={highlightKeywords}
              role="menuitemcheckbox"
            >
              Highlight keywords {highlightKeywords ? "On" : "Off"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Caption Size</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onCaptionSize("sm")}
              aria-checked={captionSize === "sm"}
              role="menuitemradio"
            >
              Small
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCaptionSize("md")}
              aria-checked={captionSize === "md"}
              role="menuitemradio"
            >
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCaptionSize("lg")}
              aria-checked={captionSize === "lg"}
              role="menuitemradio"
            >
              Large
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const html = document.documentElement
                const isHigh = html.getAttribute("data-contrast") === "high"
                html.setAttribute("data-contrast", isHigh ? "normal" : "high")
              }}
            >
              Toggle High Contrast
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
