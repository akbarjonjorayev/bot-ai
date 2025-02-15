import botData from '../botData.js'

export async function aiTextToText(prompt) {
  const model = botData.ai.getGenerativeModel({ model: 'gemini-pro' })
  const chat = model.startChat(botData.chat.history)

  const result = await chat.sendMessage(prompt)
  const { response } = result

  return response ? response : false
}
