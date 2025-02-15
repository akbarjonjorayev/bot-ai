import botData from '../botData.js'

const helpMessage = `
I'm *Telexa*, your AI assistant. I can understand both *text* and *images*, and I'll respond with *text* or *voice*.

Feel free to ask me anything!
/new - Start a fresh conversation


Made by [Akbar Jorayev](https://akbarswe.uz)
Powered by [Google Gemini](https://ai.google.dev)
`

const { bot } = botData

export async function helpCommand(msg) {
  const chatId = msg.chat.id
  await bot.sendMessage(chatId, helpMessage, {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  })
}
