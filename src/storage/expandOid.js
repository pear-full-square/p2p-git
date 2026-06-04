import { AmbiguousError } from '../errors/AmbiguousError.js'
import { NotFoundError } from '../errors/NotFoundError.js'
import { expandOidLoose } from '../storage/expandOidLoose.js'

export async function _expandOid({ fs, cache, gitdir, oid: short }) {
  const results = await expandOidLoose({ fs, gitdir, oid: short })

  if (results.length === 1) {
    return results[0]
  }
  if (results.length > 1) {
    throw new AmbiguousError('oids', short, results)
  }
  throw new NotFoundError(`an object matching "${short}"`)
}
