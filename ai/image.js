import botData from '../botData.js'

export async function aiTextToImage(image, caption) {
  const model = botData.ai.getGenerativeModel({
    model: 'models/gemini-2.0-pro-exp-02-05',
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
