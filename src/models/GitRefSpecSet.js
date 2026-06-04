// Stub: no remote refspec handling in plumbing-only mode.
export class GitRefSpecSet {
  static from (refspecs) {
    return new GitRefSpecSet()
  }

  translate (ref) {
    return null
  }

  localNamespaces () {
    return []
  }
}
