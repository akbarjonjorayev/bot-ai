import fs from 'fs'
import botData from '../botData.js'
import { aiVoiceToText } from '../ai/voice.js'
import { botSendVoice } from '../send/voice.js'
import { getMessageLink } from '../utils/getMessageLink.js'
import { ogaToMp3 } from '../utils/convert.js'

const { bot, chat } = botData

export async function handleVoice(msg) {
  const chatId = msg.chat.id
  const pendingMsg = await bot.sendMessage(chatId, 'I am thinking...')
  const pendingMsgId = pendingMsg.message_id

  try {
    const voiceLink = await getMessageLink(msg)
    const mp3Path = await ogaToMp3(voiceLink)

    chat.history.push({
      role: 'user',
      parts: `Voice url: ${voiceLink}`,
    })
    const aiRes = await aiVoiceToText(mp3Path, 'Answer to this audio gently')
    fs.unlinkSync(mp3Path)

    if (!aiRes) {
      await bot.sendMessage(chatId, `I can't answer your question. Move on.`, {
        parse_mode: 'Markdown',
      })
      return
    }

    const aiText = aiRes.text()
    await bot.sendMessage(chatId, aiText, { parse_mode: 'Markdown' })

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
