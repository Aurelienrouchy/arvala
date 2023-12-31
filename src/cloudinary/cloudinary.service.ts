import { Injectable } from '@nestjs/common'
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary'
import toStream = require('buffer-to-stream')
import axios from 'axios'
import { randomUUID } from 'crypto'
import sharp = require('sharp')

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error)
        resolve(result)
      })

      toStream(file.buffer).pipe(upload)
    })
  }

  async uploadImageUrlToCloudinary(imageUrl: string) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      })

      const name = randomUUID() + '.jpeg'

      const buffer = Buffer.from(response.data, 'base64')
      await sharp(buffer, { limitInputPixels: false })
        .toFormat('jpeg')
        .jpeg({ quality: 40 })
        .toFile('/tmp/' + name)

      const { url } = await v2.uploader.upload('/tmp/' + name, {
        folder: 'events',
        width: 500,
        crop: 'fill',
        filename_override: name
      })

      return url
    } catch (error) {
      console.log(error)
    }
  }
}
