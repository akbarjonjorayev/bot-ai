import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import botData from './botData.js'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN)

export async function telexaText(text) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  const chat = model.startChat(botData.chat.history)

  const result = await chat.sendMessage(text)
  const { response } = result

  return response ? response : false
}

export async function telexaImage(image, caption) {
  const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' })
  const imageResp = await fetch(image).then((res) => res.arrayBuffer())

  const result = await model.generateContent([
    {
      inlineData: {
        data: Buffer.from(imageResp).toString('base64'),
        mimeType: 'image/jpeg',
      },
    },
    caption,
  ])
  const { response } = result

  return response ? response : false
}
