import TelegramBot from 'node-telegram-bot-api'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from '@google/generative-ai/server'
import dotenv from 'dotenv'

dotenv.config()

const botData = {
  bot: new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { webHook: true }),
  ai: new GoogleGenerativeAI(process.env.GEMINI_TOKEN),
  aiFileManager: new GoogleAIFileManager(process.env.GEMINI_TOKEN),
  chat: {
    history: [],
  },
}

export default botData
