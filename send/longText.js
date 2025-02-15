import botData from '../botData.js'

const { bot } = botData

function splitMessage(text, limit = 4096) {
  const parts = []
  while (text.length > limit) {
    let index = text.lastIndexOf('\n', limit)
    if (index === -1) index = limit
    parts.push(text.slice(0, index).trim())
    text = text.slice(index).trim()
  }

  parts.push(text)
  return parts
}

export async function botSendLongText(chatId, longText) {
  const pendingMsg = await bot.sendMessage(chatId, 'I am sending long text...')
  const pendingMsgId = pendingMsg.message_id

  try {
    const messages = splitMessage(longText)
    const sendMessages = messages.map((msg) =>
      bot.sendMessage(chatId, msg, { parse_mode: 'Markdown' })
    )

    await Promise.all(sendMessages)
  } catch {
    await bot.sendMessage(chatId, 'Telexa cannot send long text right now.')
  } finally {
    bot.deleteMessage(chatId, pendingMsgId)
  }
}
