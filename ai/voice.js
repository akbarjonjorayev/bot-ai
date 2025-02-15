import { FileState } from '@google/generative-ai/server'
import botData from '../botData.js'

export async function aiVoiceToText(voiceURL, caption) {
  const uploadResult = await botData.aiFileManager.uploadFile(voiceURL, {
    mimeType: 'audio/mp3',
    displayName: 'Audio sample',
  })

  let file = await botData.aiFileManager.getFile(uploadResult.file.name)
  while (file.state === FileState.PROCESSING) {
    process.stdout.write('.')
    await new Promise((resolve) => setTimeout(resolve, 10_000))
    file = await botData.aiFileManager.getFile(uploadResult.file.name)
  }

  if (file.state === FileState.FAILED) return false

  const model = botData.ai.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent([
    caption,
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ])
  const { response } = result

  return response ? response : false
}
