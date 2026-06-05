# p2p-git — Minimal Git Engine for Embedding

isomorphic-git stripped to a minimal footprint for embedding in P2P
applications. Object operations, refs, index, merge, log, walk. No
porcelain, no network, no packfiles, no working tree.

**Origin:** Forked from [bare-for-pear/isomorphic-git](https://github.com/bare-for-pear/isomorphic-git)
(itself a fork of [isomorphic-git](https://github.com/isomorphic-git/isomorphic-git), MIT).

## What This Is

A minimal git engine designed for embedding. Takes isomorphic-git and
strips it to the object-level plumbing — the smallest surface that still
gives you content-addressed storage, versioned snapshots, and merge.

Entry point: `src/plumbing.js` (42 exports, down from 70 in the original).

## Transaction Model

Git's index is the transaction staging area. The write cycle:

1. **writeBlob(content)** → blobOid. Content goes into the object store.
2. **updateIndex(path, blobOid)** → staged. The index tracks the change.
3. Repeat for more changes — all staged in the index.
4. **commit** → the index becomes a committed tree. The transaction closes.

Changes are tracked from the moment they're staged. The index persists —
it survives crashes. A staged but uncommitted change can be committed
later. Commit is the quality gate, not the point of entry.

No working tree, no `git add`. Blobs are created directly, the index is
updated directly. The filesystem is not involved.

## What Was Removed

8,336 lines deleted, 78 files removed:

- **Porcelain** — add, checkout, status, clone, fetch, pull, push, stash,
  cherry-pick, notes. The working-tree workflow is not needed for embedded use.
- **Network** — HTTP transport, smart protocol, remote management. Object
  exchange is the embedder's concern.
- **Packfiles** — pack index, packed object storage. Loose objects only —
  each object individually addressable.
- **Working tree** — WORKDIR/STAGE walkers, .gitignore. No filesystem
  dependency for git operations.
- **Shallow clones** — replaced with empty sets.

## What Remains

**Object operations:** readBlob, writeBlob, readTree, writeTree, readCommit,
writeCommit, readTag, writeTag, readObject, writeObject, hashBlob

**Index:** updateIndex (transaction staging — path → blobOid)

**Refs:** resolveRef, writeRef, expandRef, expandOid, deleteRef, listBranches,
listTags, listRefs, currentBranch

**Branching:** branch, deleteBranch, tag, deleteTag

**History:** log, findMergeBase, isDescendent

**Merge:** merge (3-way text merge)

**Navigation:** walk, TREE

**Config:** getConfig, getConfigAll, setConfig

**Utility:** init, findRoot, listFiles, version

## Stubs

- **GitPackedRefs** — returns empty (loose-objects-only mode)
- **GitRefSpecSet** — returns empty (no remote handling)
- **GitShallowManager** — replaced with `new Set()`

## Usage

```js
import * as git from './src/plumbing.js'
import fs from 'bare-fs'

await git.init({ fs, dir: '/path/to/repo' })

// Write and stage
const blobOid = await git.writeBlob({ fs, dir, blob: new Uint8Array(content) })
await git.updateIndex({ fs, dir, filepath: 'file.txt', oid: blobOid })

// More changes — all staged
const blob2 = await git.writeBlob({ fs, dir, blob: new Uint8Array(content2) })
await git.updateIndex({ fs, dir, filepath: 'other.txt', oid: blob2 })

// Commit — closes the transaction
const commitOid = await git.commit({ fs, dir, message: 'batch update', author })
```

Note: `writeBlob`, `writeTree`, `writeCommit` return OID strings directly
(not `{ oid }`).

## Pluggable fs

Same as isomorphic-git — the `fs` parameter accepts any implementation.
Works on bare-fs, Hyperdrive, or any fs-compatible backend. The embedder
provides the storage; p2p-git provides the git operations.

## Current State

**Proven.** 42 plumbing operations tested under Bare. The stripping was a
learning exercise — every removed file was understood before removal. The
dependency structure is mapped.

**Not yet exercised:** merge, diff, tag operations, updateIndex flow
end-to-end, large repos.

## Intention

A minimal git engine for embedding in P2P applications. Further stripping
may continue — ~130 utility files could be pruned, and the merge/index
entanglement is a simplification target. The code is understood well enough
to make changes confidently when pressure surfaces.
