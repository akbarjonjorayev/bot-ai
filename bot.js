import express from 'express'
import botData from './botData.js'
import { handleText } from './handler/text.js'
import { handleImage } from './handler/image.js'
import { newCommand } from './commands/new.js'
import { startCommand } from './commands/start.js'
import { helpCommand } from './commands/help.js'
import { endCommand } from './commands/end.js'

const { bot } = botData
const app = express()
app.use(express.json())

const webhookUrl = `${process.env.WEBHOOK_URL}/bot${process.env.TELEGRAM_BOT_TOKEN}`
bot.setWebHook(webhookUrl)

// commands
bot.onText(/\/new/, async (msg) => await newCommand(msg))
bot.onText(/\/start/, async (msg) => await startCommand(msg))
bot.onText(/\/help/, async (msg) => await helpCommand(msg))
bot.onText(/\/end/, async (msg) => await endCommand(msg))

// messages
bot.on('message', async (msg) => {
  if (msg?.text) await handleText(msg)
})
bot.on('photo', async (msg) => await handleImage(msg))

// errors
bot.on(
  'polling_error',
  async () =>
    await bot.sendMessage(
      chatId,
      'Telexa AI is not going to answer you anymore. Try again later.'
    )
)
bot.on(
  'webhook_error',
  async () =>
    await bot.sendMessage(
      chatId,
      'Telexa AI is not going to answer you anymore. Try again later.'
    )
)

// webhook
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Bot is running on port ${PORT}`))
