import { hasObjectLoose } from '../storage/hasObjectLoose.js'

export async function hasObject({ fs, cache, gitdir, oid }) {
  return hasObjectLoose({ fs, gitdir, oid })
}
