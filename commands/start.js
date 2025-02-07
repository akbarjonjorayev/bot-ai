import botData from '../botData.js'

const { bot } = botData

export async function startCommand(msg) {
  const chatId = msg.chat.id
  await bot.sendMessage(chatId, getStartMessage(msg), {
    parse_mode: 'Markdown',
  })
}

function getStartMessage(mes) {
  return `
Hello *${mes.from.first_name}*, welcome to *Telexa*!
    
For further information click /help`
}
