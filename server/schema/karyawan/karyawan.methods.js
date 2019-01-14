const _ = require('lodash')
const fs = require('fs-extra')
const slugify = require('slugify')
const config = require('../../config/environment')

const alamatJoin = (newAlamat, oldAlamat) => {
  return new Promise(async (resolve, reject) => {
    const check = ['', '-', null, undefined]

    const n = await Promise.all(_.reduce(newAlamat, (r, v, k) => {
      const c = k === 'alamatLengkap' ? null : _.indexOf(check, v) < 0 ? `${_.upperFirst(k)} ${v}` : null
      r.push(c)
      return r
    }, []))

    const o = await Promise.all(_.reduce(oldAlamat, (r, v, k) => {
      const c = k === 'alamatLengkap' ? null : _.indexOf(check, v) < 0 ? `${_.upperFirst(k)} ${v}` : null
      r.push(c)
      return r
    }, []))

    const diff = _.difference(n, o)

    if(diff.length > 0 ) {
      return resolve(_.join(n, ' '))
    } else {
      return resolve(newAlamat.alamatLengkap)
    }
  })
}

const processUpload = async (id, image, oldImage) => {
  let { filename, mimetype, encoding, createReadStream } = await image
  let stream = createReadStream()
  let dir = `${config.root}/static/images/upload/${id}`

  filename = slugify(filename, { lower: true })
  await fs.ensureDir(dir)
  if(oldImage) {
    await fs.remove(`${dir}/${oldImage}`)
  }
  let realPath = `${dir}/${filename}`
  let path = `/images/upload/${id}/${filename}`

  return new Promise(async (resolve, reject) =>
    stream
    .on('error', async (error) => {
      if (stream.truncated)
        await fs.unlinkSync(realPath)
      reject(error)
    })
    .pipe(await fs.createWriteStream(realPath))
    .on('finish', () => resolve({
      image: {
      path, filename, mimetype, encoding
      }
    })))
}

module.exports = {
  alamatJoin,
  processUpload
}
