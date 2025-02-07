import botData from '../botData.js'

const { bot, chat } = botData

export async function endCommand(msg) {
  const chatId = msg.chat.id
  chat.history = []

  await bot.sendMessage(chatId, 'That was funny. See you next time 😊 /new')
}
