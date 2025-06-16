import type { NextApiRequest, NextApiResponse } from "next"
import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.body

  const result = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  })

  const text = result.text

  try {
    res.status(200).json({ data: { text: text } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Text generation failed." })
  }
}
