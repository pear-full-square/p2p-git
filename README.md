# p2p-git — Stripped Git Plumbing for P2P

isomorphic-git stripped to plumbing only. The git engine for Mycelium — object
operations, refs, merge, log, walk. No porcelain, no network, no packfiles.

**Origin:** Forked from [bare-for-pear/isomorphic-git](https://github.com/bare-for-pear/isomorphic-git)
(itself a fork of [isomorphic-git](https://github.com/isomorphic-git/isomorphic-git), MIT).

## What This Is

A stripped git engine for P2P-native use. Takes isomorphic-git and removes
everything the P2P substrate provides natively or that Mycelium doesn't need.
The remaining code is the object-level git operations — read, write, navigate,
merge, commit.

Entry point: `src/plumbing.js` (41 exports, down from 70 in the original).

## What Was Removed

8,336 lines deleted, 78 files removed:

- **Porcelain** — add, checkout, status, statusMatrix, clone, fetch, pull, push,
  stash, cherry-pick, fast-forward, abort-merge, rename-branch, notes
- **Network** — HTTP transport, smart protocol (wire/), remote management,
  credential handling, server ref listing
- **Packfiles** — pack index, packed object read/write/expand, packObjects,
  indexPack. Storage is loose-objects-only.
- **Working tree** — WORKDIR walker, STAGE walker, isIgnored, index-based
  operations (the index is kept for merge but working-tree operations removed)
- **Shallow clones** — GitShallowManager replaced with empty sets

## What Remains

**Object operations:** readBlob, writeBlob, readTree, writeTree, readCommit,
writeCommit, readTag, writeTag, readObject, writeObject, hashBlob

**Refs:** resolveRef, writeRef, expandRef, expandOid, deleteRef, listBranches,
listTags, listRefs, currentBranch

**Branching:** branch, deleteBranch, tag, deleteTag

**History:** log, findMergeBase, isDescendent

**Merge:** merge (3-way text merge, retains index dependency)

**Navigation:** walk, TREE

**Config:** getConfig, getConfigAll, setConfig

**Utility:** init, findRoot, listFiles, version

## Stubs

- **GitPackedRefs** — returns empty (no packed refs in loose-objects-only mode)
- **GitRefSpecSet** — returns empty (no remote refspec handling)
- **GitShallowManager** — replaced with `new Set()` (no shallow clones)

## Usage

```js
import * as git from './src/plumbing.js'
import fs from 'bare-fs'

await git.init({ fs, dir: '/path/to/repo' })

// The plumbing write path — no working tree, no add
const blobOid = await git.writeBlob({ fs, dir, blob: new Uint8Array(content) })
const treeOid = await git.writeTree({ fs, dir, tree: [
  { mode: '100644', path: 'file.txt', oid: blobOid, type: 'blob' }
] })
const commitOid = await git.writeCommit({ fs, dir, commit: {
  tree: treeOid, parent: [], author, committer, message
} })
await git.writeRef({ fs, dir, ref: 'refs/heads/main', value: commitOid })
```

Note: `writeBlob`, `writeTree`, `writeCommit` return OID strings directly
(not `{ oid }`).

## Current State

**Proven.** All 41 plumbing operations tested under Bare: init, writeBlob,
writeTree, writeCommit, writeRef, readBlob, readTree, readCommit, resolveRef,
log, walk, branch, listBranches.

The stripping was the learning exercise — every removed file was understood
before removal. The dependency structure is mapped: storage layer (loose only),
ref manager (packed-refs stubbed), merge (index retained), walk (repo walker
only).

**Not yet exercised:** merge, diff, tag operations, config operations, large
repos.

## Intention

Foundation for the Mycelium git component
([pear-full-square/mycelium](https://github.com/pear-full-square/mycelium)).
Mycelium calls into p2p-git for object operations and wraps it with fabric
semantics: XPath navigation, CRUD, the Kafka record boundary mapper.

Further stripping may continue — ~130 utility files could be pruned, and the
merge/index entanglement is a simplification target. The code is understood
well enough to make changes confidently when pressure surfaces.
