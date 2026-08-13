import { afterEach, describe, expect, it } from 'vitest'

import { $sidebarProjectFilter } from './layout'
import { applyProjectTreePayload } from './projects'

afterEach(() => {
  $sidebarProjectFilter.set([])
})

function treePayload(projects: unknown[]): Parameters<typeof applyProjectTreePayload>[0] {
  return { projects: projects as never, active_id: null, scoped_session_ids: [] }
}

describe('project-filter reconciliation on authoritative tree load', () => {
  it('drops persisted project-filter ids that are missing from the live tree', () => {
    $sidebarProjectFilter.set(['gone-1', 'live-2'])

    applyProjectTreePayload(treePayload([{ id: 'live-2', path: null, repos: [] }]))

    expect($sidebarProjectFilter.get()).toEqual(['live-2'])
  })

  it('keeps repo-root-path ids that still exist as a repo node', () => {
    $sidebarProjectFilter.set(['/home/badi/repo'])

    applyProjectTreePayload(
      treePayload([{ id: 'p1', path: null, repos: [{ id: 'r1', path: '/home/badi/repo' }] }])
    )

    expect($sidebarProjectFilter.get()).toEqual(['/home/badi/repo'])
  })

  it('clears nothing when the tree comes back empty (partial truth never clobbers)', () => {
    $sidebarProjectFilter.set(['gone-1'])

    applyProjectTreePayload(treePayload([]))

    expect($sidebarProjectFilter.get()).toEqual(['gone-1'])
  })
})
