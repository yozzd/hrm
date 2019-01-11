const _ = require('lodash')

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

module.exports = {
  alamatJoin
}
