import type { SidebarProjectTree } from '@/app/chat/sidebar/projects/workspace-groups'

/**
 * Reconciliation for the persisted sidebar project filter against the
 * authoritative live project tree.
 *
 * Filter ids outlive the projects they name: a project gets deleted or
 * renamed on the backend, the user switches profile or backend, and the
 * persisted id keeps matching zero sessions — the sidebar renders "No
 * sessions match these filters" until the user manually resets the whole
 * view. Persistence itself is deliberate (the filter menu keeps state across
 * restarts), so the fix is to drop only the ids that provably no longer
 * exist, never the persistence.
 */

/**
 * The ids a persisted project filter may legitimately hold: every explicit
 * project id, every repo node id, and every project/repo root path (an
 * auto-promoted project is addressed by its repo root path, which the tree
 * reports on the repo node).
 */
export function projectTreeFilterIds(tree: readonly SidebarProjectTree[]): string[] {
  const seen = new Set<string>()

  const add = (value: null | string): void => {
    if (value && !seen.has(value)) {
      seen.add(value)
    }
  }

  for (const project of tree) {
    add(project.id)
    add(project.path)

    for (const repo of project.repos ?? []) {
      add(repo.id)
      add(repo.path)
    }
  }

  return [...seen]
}

/**
 * Drops persisted project-filter ids that no longer exist in the live id
 * list, preserving persisted order. Returns the SAME reference when nothing
 * is dropped so callers keep reference identity on no-ops (a fresh array
 * would re-run every downstream recompute for no change).
 *
 * Caller contract: only pass a live list that is known complete — the
 * authoritative tree fetch succeeded. A partial or empty list must never be
 * passed; on partial truth the persisted filter is left untouched (a stale
 * filter is recoverable, a wrongly cleared one is not).
 */
export function reconcileProjectFilterIds(
  persisted: readonly string[],
  live: readonly string[]
): readonly string[] {
  if (persisted.length === 0) {
    return persisted
  }

  const liveSet = new Set(live)
  const survivors = persisted.filter(id => liveSet.has(id))

  return survivors.length === persisted.length ? persisted : survivors
}
