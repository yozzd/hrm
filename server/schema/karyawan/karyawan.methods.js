const _ = require('lodash')
const fs = require('fs-extra')
const slugify = require('slugify')
const jimp = require('jimp')
const config = require('../../config/environment')

const capitalizeWords = (str) => {
  return new Promise((resolve, reject) => {
    return resolve(str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    }))
  })
}

const processUpload = async (id, image, oldImage) => {
  let { filename, mimetype, encoding, createReadStream } = await image
  let stream = createReadStream()
  const dir = `${config.root}/static/images/upload/${id}`

  filename = slugify(filename, { lower: true })
  await fs.ensureDir(dir)
  if(oldImage) {
    await fs.remove(`${dir}/${oldImage}`)
  }
  const tmp = `/tmp/${filename}`
  const realPath = `${dir}/${filename}`
  const path = `/images/upload/${id}/${filename}`

  return new Promise(async (resolve, reject) =>
    stream
    .on('error', async (error) => {
      if (stream.truncated)
        await fs.unlinkSync(tmp)
      reject(error)
    })
    .pipe(await fs.createWriteStream(tmp))
    .on('finish', async () => {
      await processImage(tmp, realPath)
      return resolve({
        image: {
          path, filename, mimetype, encoding
        }
      })}))
}

const processImage = async (file, path) => {
  try {
    const image = await jimp.read(file)
    return await image.resize(480, 640).write(path)
  } catch(err) {
    throw err
  }
}

module.exports = {
  capitalizeWords,
  processUpload
}
