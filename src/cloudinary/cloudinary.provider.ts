import { ConfigOptions, v2 } from 'cloudinary'

export const CloudinaryProvider = {
  provide: 'cloudinary',
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: 'dg7zxj4gf',
      api_key: '179513934118298',
      api_secret: '2ScsDltXftEBOB6tkVAe2MM4Ab0'
    })
  }
}
