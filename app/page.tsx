"use client"

import Hero from "@/components/Hero"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RxReload } from "react-icons/rx"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import Markdown from "react-markdown"

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [text, setText] = useState<string>("")

  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleButtonClick = async () => {
    if (inputValue) {
      setLoading(true)
      setText("")

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: inputValue }),
        })

        const { data: text } = await response.json()

        setText(text.text)
      } catch (err: any) {
        // console.log(err)
      }

      setLoading(false)
      setInputValue("")
    } else {
      toast({
        description: "Input field can't be empty.",
      })
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <Hero />
      <div className="w-72 md:w-[28rem] flex flex-col md:flex-row justify-center items-center gap-4">
        <Input
          placeholder="eg. what is AI"
          value={inputValue}
          onChange={handleInputChange}
        />
        {loading ? (
          <Button className="w-72 md:w-32" disabled>
            <RxReload className="mr-2 h-4 w-4 animate-spin" />
            Generating
          </Button>
        ) : (
          <Button className="w-72 md:w-32" onClick={handleButtonClick}>
            Generate
          </Button>
        )}
      </div>
      <div className="w-72 md:w-[28rem]">
        {loading ? (
          <div className="flex flex-col space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-72 md:w-[28rem]" />
              <Skeleton className="h-4 w-72 md:w-[28rem]" />
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 w-72 md:w-[28rem] h-fit p-4">
            &gt; <Markdown>{text}</Markdown>
          </div>
        )}
      </div>
    </div>
  )
}
