import { afterEach, describe, expect, it } from 'vitest'

import {
  $sidebarCardRows,
  $sidebarFiltersActive,
  $sidebarGrouping,
  $sidebarOrdering,
  $sidebarPrFilter,
  $sidebarProfileFilter,
  $sidebarProjectFilter,
  $sidebarRowMeta,
  $sidebarShowArchived,
  $sidebarStatusFilter,
  clearSidebarFilters,
  resetSidebarView,
  setSidebarGrouping,
  setSidebarOrdering
} from './layout'

// The view a fresh boot ships: the atoms' initial values in this process.
// resetSidebarView's contract is "back to shipped defaults", whatever those
// are on this build — asserted against boot state, not literals.
const shipped = {
  cardRows: $sidebarCardRows.get(),
  grouping: $sidebarGrouping.get(),
  ordering: $sidebarOrdering.get(),
  rowMeta: $sidebarRowMeta.get()
}

afterEach(() => {
  resetSidebarView()
})

describe('clearSidebarFilters', () => {
  it('empties every filter atom and leaves the rest of the view alone', () => {
    $sidebarStatusFilter.set(['working'])
    $sidebarProjectFilter.set(['x'])
    $sidebarProfileFilter.set(['sabby'])
    $sidebarPrFilter.set(['open'] as never)
    $sidebarShowArchived.set(true)
    setSidebarGrouping('status')

    clearSidebarFilters()

    expect($sidebarStatusFilter.get()).toEqual([])
    expect($sidebarProjectFilter.get()).toEqual([])
    expect($sidebarProfileFilter.get()).toEqual([])
    expect($sidebarPrFilter.get()).toEqual([])
    expect($sidebarShowArchived.get()).toBe(false)
    expect($sidebarFiltersActive.get()).toBe(false)
    // Narrower than a full reset: grouping survives.
    expect($sidebarGrouping.get()).toBe('status')
  })
})

describe('resetSidebarView', () => {
  it('restores the shipped view defaults', () => {
    setSidebarGrouping('status')
    setSidebarOrdering('created')
    $sidebarRowMeta.set(['cost'])
    $sidebarCardRows.set(!shipped.cardRows)
    $sidebarStatusFilter.set(['working'])

    resetSidebarView()

    expect($sidebarGrouping.get()).toBe(shipped.grouping)
    expect($sidebarOrdering.get()).toBe(shipped.ordering)
    expect($sidebarRowMeta.get()).toEqual(shipped.rowMeta)
    expect($sidebarCardRows.get()).toBe(shipped.cardRows)
    expect($sidebarFiltersActive.get()).toBe(false)
  })
})
