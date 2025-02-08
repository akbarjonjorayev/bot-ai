import botData from '../botData.js'

const helpMessage = `
I'm *Telexa*, your AI assistant. I can understand both *text* and *images*, and I'll respond with *text* or *voice*. Ready to chat?

Feel free to ask me anything!
/new - Start a fresh conversation


Powered by [Google Gemini](https://ai.google.dev).
Author: [Akbar Jorayev](https://akbarswe.uz)
`

const { bot } = botData

export async function helpCommand(msg) {
  const chatId = msg.chat.id
  await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' })
}
