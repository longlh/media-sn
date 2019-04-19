import { Uploader } from 'plupload'

const uploader = new Uploader({
  browse_button: 'upload',
  url: '/api/v1/upload'
})

