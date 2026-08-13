import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { $sidebarProjectFilter } from '@/store/layout'

import { SessionsEmptyState } from './sessions-empty-state'

afterEach(cleanup)

vi.mock('@/i18n', () => ({
  useI18n: () => ({
    t: {
      sidebar: {
        allPinned: 'Everything here is pinned',
        noFilterMatches: 'No sessions match these filters',
        noSessions: 'No sessions yet',
        projectEmpty: 'No sessions yet',
        resetFilters: 'Reset filters'
      }
    }
  })
}))

describe('SessionsEmptyState', () => {
  it('shows the reset action when filters are active', () => {
    $sidebarProjectFilter.set(['x'])

    render(<SessionsEmptyState filtersActive hasPinned={false} inProject={false} />)

    expect(screen.getByRole('button', { name: 'Reset filters' })).toBeTruthy()
    expect(screen.getByText('No sessions match these filters')).toBeTruthy()
  })

  it('does not show the reset action when no filters are active', () => {
    $sidebarProjectFilter.set([])

    render(<SessionsEmptyState filtersActive={false} hasPinned={false} inProject={false} />)

    expect(screen.queryByRole('button', { name: 'Reset filters' })).toBeNull()
    expect(screen.getByText('No sessions yet')).toBeTruthy()
  })

  it('clicking reset clears the filters', () => {
    $sidebarProjectFilter.set(['x'])

    render(<SessionsEmptyState filtersActive hasPinned={false} inProject={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }))

    expect($sidebarProjectFilter.get()).toEqual([])
  })

  it('does not offer reset inside a project drill-in', () => {
    render(<SessionsEmptyState filtersActive hasPinned={false} inProject />)

    expect(screen.queryByRole('button', { name: 'Reset filters' })).toBeNull()
    expect(screen.getByText('No sessions yet')).toBeTruthy()
  })
})
