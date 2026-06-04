// Quick test: does the plumbing entry point work for our core operations?
// Run with: bare test-plumbing.mjs (or node --experimental-vm-modules test-plumbing.mjs)

import * as git from './src/plumbing.js'
import fs from 'bare-fs'

const dir = '/tmp/test-plumbing'

async function main () {
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })

  // init
  await git.init({ fs, dir })
  console.log('init: ok')

  // plumbing write path
  const blobOid = await git.writeBlob({ fs, dir, blob: new Uint8Array(Buffer.from('hello plumbing\n')) })
  console.log('writeBlob:', blobOid.slice(0, 12))

  const treeOid = await git.writeTree({
    fs, dir,
    tree: [{ mode: '100644', path: 'test.txt', oid: blobOid, type: 'blob' }]
  })
  console.log('writeTree:', treeOid.slice(0, 12))

  const commitOid = await git.writeCommit({
    fs, dir,
    commit: {
      tree: treeOid,
      parent: [],
      author: { name: 'spl', email: 's@splectrum', timestamp: 1000000, timezoneOffset: 0 },
      committer: { name: 'spl', email: 's@splectrum', timestamp: 1000000, timezoneOffset: 0 },
      message: 'plumbing test\n'
    }
  })
  console.log('writeCommit:', commitOid.slice(0, 12))

  await git.writeRef({ fs, dir, ref: 'refs/heads/main', value: commitOid })
  console.log('writeRef: ok')

  // read back
  const { blob } = await git.readBlob({ fs, dir, oid: blobOid })
  console.log('readBlob:', Buffer.from(blob).toString().trim())

  const { tree } = await git.readTree({ fs, dir, oid: treeOid })
  console.log('readTree:', tree.length, 'entries, first:', tree[0].path)

  const { commit } = await git.readCommit({ fs, dir, oid: commitOid })
  console.log('readCommit:', commit.message.trim())

  // log
  const logs = await git.log({ fs, dir, ref: 'main' })
  console.log('log:', logs.length, 'commits')

  // walk
  const files = await git.walk({ fs, dir, trees: [git.TREE({ ref: 'main' })], map: async (filepath, [entry]) => filepath })
  console.log('walk:', files.filter(f => f !== '.').length, 'files')

  // branch
  await git.branch({ fs, dir, ref: 'test-branch' })
  const branches = await git.listBranches({ fs, dir })
  console.log('branches:', branches)

  // resolve
  const resolved = await git.resolveRef({ fs, dir, ref: 'main' })
  console.log('resolveRef main:', resolved.slice(0, 12))

  console.log('\nAll plumbing operations work.')
  Bare.exit(0)
}

main().catch(e => { console.error('ERR', e.stack || e.message); Bare.exit(1) })
