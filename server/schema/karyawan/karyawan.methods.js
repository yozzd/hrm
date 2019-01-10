const _ = require('lodash')

const alamatJoin = (newAlamat, oldAlamat) => {
  const check = ['', '-', null, undefined]

  const n = _.reduce(newAlamat, (r, v, k) => {
    const c = k === 'alamatLengkap' ? null : _.indexOf(check, v) < 0 ? `${_.upperFirst(k)} ${v}` : null
    r.push(c)
    return r
  }, [])

  const o = _.reduce(oldAlamat, (r, v, k) => {
    const c = k === 'alamatLengkap' ? null : _.indexOf(check, v) < 0 ? `${_.upperFirst(k)} ${v}` : null
    r.push(c)
    return r
  }, [])

  const diff = _.difference(n, o)

  if(diff.length > 0 ) {
    return _.join(n, ' ')
  } else {
    return newAlamat.alamatLengkap
  }
}

module.exports = {
  alamatJoin
}
