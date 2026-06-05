// Plumbing-only entry point for isomorphic-git.
// Exports only the object-level and ref-level operations needed
// for P2P native git. No porcelain, no network, no packfiles.

import './typedefs.js'

// Object operations
import { readBlob } from './api/readBlob.js'
import { writeBlob } from './api/writeBlob.js'
import { readTree } from './api/readTree.js'
import { writeTree } from './api/writeTree.js'
import { readCommit } from './api/readCommit.js'
import { writeCommit } from './api/writeCommit.js'
import { readTag } from './api/readTag.js'
import { writeTag } from './api/writeTag.js'
import { readObject } from './api/readObject.js'
import { writeObject } from './api/writeObject.js'
import { hashBlob } from './api/hashBlob.js'

// Refs
import { resolveRef } from './api/resolveRef.js'
import { writeRef } from './api/writeRef.js'
import { expandRef } from './api/expandRef.js'
import { expandOid } from './api/expandOid.js'
import { deleteRef } from './api/deleteRef.js'
import { listBranches } from './api/listBranches.js'
import { listTags } from './api/listTags.js'
import { listRefs } from './api/listRefs.js'
import { currentBranch } from './api/currentBranch.js'

// Branching
import { branch } from './api/branch.js'
import { deleteBranch } from './api/deleteBranch.js'
import { tag } from './api/tag.js'
import { deleteTag } from './api/deleteTag.js'

// History
import { log } from './api/log.js'
import { findMergeBase } from './api/findMergeBase.js'
import { isDescendent } from './api/isDescendent.js'

// Merge
import { merge } from './api/merge.js'

// Navigation
import { walk } from './api/walk.js'
import { TREE } from './api/TREE.js'

// Config
import { getConfig } from './api/getConfig.js'
import { getConfigAll } from './api/getConfigAll.js'
import { setConfig } from './api/setConfig.js'

// Index (transaction staging)
import { updateIndex } from './api/updateIndex.js'

// Utility
import { init } from './api/init.js'
import { findRoot } from './api/findRoot.js'
import { listFiles } from './api/listFiles.js'
import { version } from './api/version.js'

export {
  // Object operations
  readBlob, writeBlob,
  readTree, writeTree,
  readCommit, writeCommit,
  readTag, writeTag,
  readObject, writeObject,
  hashBlob,
  // Refs
  resolveRef, writeRef, expandRef, expandOid, deleteRef,
  listBranches, listTags, listRefs, currentBranch,
  // Branching
  branch, deleteBranch, tag, deleteTag,
  // History
  log, findMergeBase, isDescendent,
  // Merge
  merge,
  // Navigation
  walk, TREE,
  // Index (transaction staging)
  updateIndex,
  // Config
  getConfig, getConfigAll, setConfig,
  // Utility
  init, findRoot, listFiles, version,
}
