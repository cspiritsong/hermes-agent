import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n'
import { clearSidebarFilters } from '@/store/layout'

interface SessionsEmptyStateProps {
  filtersActive: boolean
  hasPinned: boolean
  inProject: boolean
}

/**
 * The session-list empty state. Which message shows depends on the view; an
 * active filter that hides every row additionally gets a one-click reset so a
 * stale persisted filter can't strand the user behind an empty list.
 */
export function SessionsEmptyState({ filtersActive, hasPinned, inProject }: SessionsEmptyStateProps) {
  const { t } = useI18n()
  const s = t.sidebar

  const message = inProject
    ? s.projectEmpty
    : filtersActive
      ? s.noFilterMatches
      : hasPinned
        ? s.allPinned
        : s.noSessions

  return (
    <div className="grid min-h-16 place-items-center rounded-lg px-2 text-center text-xs text-(--ui-text-tertiary)">
      {message}
      {!inProject && filtersActive ? (
        <Button onClick={() => clearSidebarFilters()} size="xs" type="button" variant="text">
          {s.resetFilters}
        </Button>
      ) : null}
    </div>
  )
}
