import botData from '../botData.js'

const { bot } = botData

export async function botSendVoice(chatId, text) {
  const speakingMsg = await bot.sendMessage(chatId, 'I am speaking...')
  const speakingMsgId = speakingMsg.message_id

  try {
    const textToEncode = encodeURIComponent(text)
    const voiceUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${textToEncode}&tl=en&total=1&idx=0&textlen=${text.length}&client=tw-ob&prev=input`

    await bot.sendAudio(chatId, voiceUrl, { filename: 'telexa.mp3' })
  } catch {
    await bot.sendMessage(chatId, 'Telexa cannot speak right now.')
  } finally {
    bot.deleteMessage(chatId, speakingMsgId)
  }
}
