// Stub: no packed refs in loose-objects-only mode.
// Returns an empty packed-refs structure so GitRefManager works unchanged.
export class GitPackedRefs {
  constructor () {
    this.refs = new Map()
  }

  static from (text) {
    return new GitPackedRefs()
  }

  delete (ref) {}

  toString () {
    return ''
  }
}
