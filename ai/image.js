import botData from '../botData.js'

export async function aiTextToImage(image, caption) {
  const model = botData.ai.getGenerativeModel({
    model: 'models/gemini-1.5-pro',
  })
  const imageResp = await fetch(image).then((res) => res.arrayBuffer())

  const result = await model.generateContent([
    {
      inlineData: {
        data: Buffer.from(imageResp).toString('base64'),
        mimeType: 'image/jpeg',
      },
    },
    caption,
  ])
  const { response } = result

  return response ? response : false
}
