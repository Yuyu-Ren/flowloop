import filter from 'object-loops/filter'
import get from '101/pluck'
import groupBy from '101/group-by'
import values from 'object-loops/values'
import { createSelector } from 'reselect'

/*
 * Returns midnight
 */

export const midnight = createSelector(
  state => get(state, 'time.now'),
  now => truncateDate(now))

/*
 * Recent work logs
 */

export const recents = createSelector(
  state => state.log,
  state => midnight(state),
  (log, time) => {
    log = filter(log, i => i.timerType === 'work')
    log = filter(log, i => i.startedAt > time)
    return log
  })

/*
 * By date
 */

export const byDate = createSelector(
  state => state.log || {},
  log => {
    return groupBy(values(log), item => +truncateDate(item.startedAt))
  })

/*
 * Truncates a date to midnight
 */

export function truncateDate (date) {
  return new Date(Math.floor(+date / 86400000) * 86400000)
}

/*
 * Export
 */

export default {
  recents,
  byDate,
}
