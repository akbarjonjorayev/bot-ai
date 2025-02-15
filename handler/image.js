import botData from '../botData.js'
import { aiTextToImage } from '../ai/image.js'
import { botSendVoice } from '../send/voice.js'
import { getMessageLink } from '../utils/getMessageLink.js'

const { bot, chat } = botData

export async function handleImage(msg) {
  const chatId = msg.chat.id
  const pendingMsg = await bot.sendMessage(chatId, 'I am thinking...')
  const pendingMsgId = pendingMsg.message_id

  try {
    const imageLink = await getMessageLink(msg)
    const description = msg.caption
      ? msg?.caption
      : `This is image from ${msg.from.first_name}. You are Telexa AI. What do you see in this image?`

    chat.history.push({
      role: 'user',
      parts: `Image url: ${imageLink} and description: ${description}`,
    })
    const aiRes = await aiTextToImage(imageLink, description)

    if (!aiRes) {
      await bot.sendMessage(chatId, `I can't answer your question. Move on.`, {
        parse_mode: 'Markdown',
      })
      return
    }

    const aiText = aiRes.text()
    try {
      await bot.sendMessage(chatId, aiText, { parse_mode: 'Markdown' })
    } catch {
      await bot.sendMessage(chatId, aiText)
    }

    bot.deleteMessage(chatId, pendingMsgId)
    await botSendVoice(chatId, aiText)

    chat.history.push({ role: 'model', parts: aiText })
  } catch {
    chat.history = []

    bot.deleteMessage(chatId, pendingMsgId)
    await bot.sendMessage(
      chatId,
      'Telexa AI is not going to answer you anymore. Try again later.'
    )
  }
}
