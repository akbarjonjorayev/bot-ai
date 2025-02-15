import botData from '../botData.js'

export async function getMessageLink(msg) {
  const fileId = getFileId(msg)
  const link = await botData.bot.getFileLink(fileId)

  return link
}

function getFileId(msg) {
  if (msg?.voice) return msg.voice.file_id
  if (msg?.photo) return msg.photo[msg.photo.length - 1].file_id

  throw new Error('Unsupported message type')
}
