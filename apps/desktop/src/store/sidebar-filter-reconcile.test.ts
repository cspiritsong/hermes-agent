import { describe, expect, it } from 'vitest'

import { projectTreeFilterIds, reconcileProjectFilterIds } from './sidebar-filter-reconcile'

describe('reconcileProjectFilterIds', () => {
  it('drops persisted ids that no longer exist in the live list', () => {
    expect(reconcileProjectFilterIds(['gone-1', 'live-2'], ['live-2', 'live-3'])).toEqual(['live-2'])
  })

  it('keeps every persisted id that still exists', () => {
    expect(reconcileProjectFilterIds(['a', 'b'], ['a', 'b', 'c'])).toEqual(['a', 'b'])
  })

  it('is a no-op when nothing is persisted', () => {
    expect(reconcileProjectFilterIds([], ['a'])).toEqual([])
  })

  it('preserves persisted order', () => {
    expect(reconcileProjectFilterIds(['b', 'a'], ['a', 'b'])).toEqual(['b', 'a'])
  })

  it('returns the same reference when nothing is dropped', () => {
    const persisted = ['a', 'b']

    expect(reconcileProjectFilterIds(persisted, ['a', 'b', 'c'])).toBe(persisted)
  })
})

describe('projectTreeFilterIds', () => {
  it('collects project ids, repo ids and root paths from the tree', () => {
    const ids = projectTreeFilterIds([
      {
        id: 'proj-1',
        path: '/work/proj-1',
        repos: [{ id: '/work/proj-1', path: '/work/proj-1' }]
      } as never
    ])

    expect(ids).toEqual(['proj-1', '/work/proj-1'])
  })

  it('skips null paths', () => {
    const ids = projectTreeFilterIds([
      { id: 'proj-1', path: null, repos: [{ id: 'repo-1', path: null }] } as never
    ])

    expect(ids).toEqual(['proj-1', 'repo-1'])
  })
})
