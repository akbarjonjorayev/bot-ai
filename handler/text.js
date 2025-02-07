import botData from '../botData.js'
import { telexaText } from '../ai.js'
import { botSendVoice } from '../conversation/voice.js'

const { bot, chat } = botData

export async function handleText(msg) {
  if (msg.text.startsWith('/')) return

  const chatId = msg.chat.id
  const thinkingMsg = await bot.sendMessage(chatId, 'I am thinking...')
  const thinkingMsgId = thinkingMsg.message_id

  try {
    chat.history.push({ role: 'user', parts: msg.text })
    const aiRes = await telexaText(msg.text)

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
    } finally {
      bot.deleteMessage(chatId, thinkingMsgId)
      await botSendVoice(chatId, aiText)
    }

    chat.history.push({ role: 'model', parts: aiText })
  } catch {
    chat.history = []

    bot.deleteMessage(chatId, thinkingMsgId)
    await bot.sendMessage(
      chatId,
      'Telexa AI is not going to answer you anymore. Try again later.'
    )
  }
}
