import botData from '../botData.js'
import { aiTextToText } from '../ai/text.js'
import { botSendVoice } from '../send/voice.js'
import { botSendLongText } from '../send/longText.js'

const { bot, chat } = botData

export async function handleText(msg) {
  if (msg.text.startsWith('/')) return

  const chatId = msg.chat.id
  const pendingMsg = await bot.sendMessage(chatId, 'I am thinking...')
  const pendingMsgId = pendingMsg.message_id

  try {
    chat.history.push({ role: 'user', parts: msg.text })
    const aiRes = await aiTextToText(msg.text)

    if (!aiRes) {
      await bot.sendMessage(chatId, `I can't answer your question. Move on.`, {
        parse_mode: 'Markdown',
      })
      return
    }

    const aiText = aiRes.text()
    if (aiText.length > 4096) {
      await botSendLongText(chatId, aiText)
    } else {
      try {
        await bot.sendMessage(chatId, aiText, { parse_mode: 'Markdown' })
      } catch {
        await bot.sendMessage(chatId, aiText)
      }
    }

    bot.deleteMessage(chatId, pendingMsgId)
    await botSendVoice(chatId, aiText)

    chat.history.push({ role: 'model', parts: aiText })
  } catch {
    chat.history = []

    await bot.sendMessage(
      chatId,
      'Telexa AI is not going to answer you anymore. Try again later.'
    )
  }
}
