import botData from '../botData.js'

const { bot } = botData

export async function botSendVoice(chatId, text) {
  const pendingMsg = await bot.sendMessage(chatId, 'I am speaking...')
  const pendingMsgId = pendingMsg.message_id

  try {
    const textToEncode = encodeURIComponent(text)
    const voiceUrl = getVoiceUrl(textToEncode, text.length)

    await bot.sendVoice(chatId, voiceUrl, { filename: 'telexa.mp3' })
  } catch {
    await bot.sendMessage(chatId, 'Telexa cannot speak right now.')
  } finally {
    bot.deleteMessage(chatId, pendingMsgId)
  }
}

function getVoiceUrl(textToEncode, length) {
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${textToEncode}&tl=en&total=1&idx=0&textlen=${length}&client=tw-ob&prev=input`
}
