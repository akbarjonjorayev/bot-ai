import botData from '../botData.js'
import { telexaImage } from '../ai.js'

const { bot, chat } = botData

export async function handleImage(msg) {
  const chatId = msg.chat.id
  const thinkingMsg = await bot.sendMessage(chatId, 'I am thinking...')
  const thinkingMsgId = thinkingMsg.message_id

  try {
    const imageLink = await getLink(msg)
    const description = msg.caption ? msg?.caption : 'What in this image?'

    chat.history.push({
      role: 'user',
      parts: `Image url: ${imageLink} and description: ${description}`,
    })
    const aiRes = await telexaImage(imageLink, description)

    if (!aiRes) {
      await bot.sendMessage(chatId, `I can't answer your question. Move on.`, {
        parse_mode: 'Markdown',
      })
      return
    }

    const aiText = aiRes.text()
    try {
      await bot.sendMessage(chatId, aiText, { parse_mode: 'Markdown' })
    } catch (error) {
      await bot.sendMessage(chatId, aiText)
    }

    chat.history.push({ role: 'model', parts: aiText })
  } catch {
    chat.history = []

    await bot.sendMessage(
      chatId,
      'Telexa AI is not going to answer you anymore. Try again later.'
    )
  } finally {
    bot.deleteMessage(chatId, thinkingMsgId)
  }
}

async function getLink(msg) {
  const fileId = msg.photo[msg.photo.length - 1].file_id
  const file = await botData.bot.getFile(fileId)
  const filePath = file.file_path
  const imageUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`

  return imageUrl
}
