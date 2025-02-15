import fs from 'fs'
import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { fileURLToPath } from 'url'
import path from 'path'

ffmpeg.setFfmpegPath(ffmpegPath.path)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function ogaToMp3(ogaUrl) {
  const tempOggPath = path.join(__dirname, `voice_${Date.now()}.oga`)
  const outputMp3Path = path.join(__dirname, `voice_${Date.now()}.mp3`)

  const response = await axios({
    url: ogaUrl,
    method: 'GET',
    responseType: 'stream',
  })

  const writer = fs.createWriteStream(tempOggPath)
  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      ffmpeg(tempOggPath)
        .output(outputMp3Path)
        .toFormat('mp3')
        .on('end', () => {
          fs.unlinkSync(tempOggPath)
          resolve(outputMp3Path)
        })
        .on('error', (err) => {
          reject(err)
        })
        .run()
    })

    writer.on('error', (err) => {
      reject(err)
    })
  })
}
