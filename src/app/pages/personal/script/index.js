import { Uploader } from 'plupload'

const uploader = new Uploader({
  browse_button: 'browse',
  url: '/api/v1/upload',
  chunk_size: '200kb',
  unique_names: true
})

uploader.bind('FilesAdded', (uploader, files) => {
  const queue = document.getElementById('queue')

  files.forEach((file) => {
     const item = document.createElement('li')

     item.id = file.id
     item.innerHTML = file.name

     queue.appendChild(item)
  })
})

uploader.bind('QueueChanged', (uploader) => {
  const uploadButton = document.getElementById('upload')

  uploadButton.style.visibility = uploader.files.length ? 'visible': 'hidden'
})

uploader.bind('FileUploaded', (uploader, file, result) => {
  console.log(file, result)
})

uploader.bind('Error', (uploader, error) => {
  console.error(error)
})

document.getElementById('upload').addEventListener('click', () => {
  uploader.start()
})

uploader.init()
