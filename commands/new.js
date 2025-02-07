import botData from '../botData.js'

const { bot, chat } = botData

export async function newCommand(msg) {
  const chatId = msg.chat.id
  chat.history = [
    {
      role: 'user',
      parts: 'New conversation started.',
    },
  ]

  await bot.sendMessage(
    chatId,
    `Hello *${msg.chat.first_name}*! I am *Telexa*. How can I help you?`,
    { parse_mode: 'Markdown' }
  )
}
