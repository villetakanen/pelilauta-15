import type { Component, Signal } from 'solid-js'
import type { CnPill } from '@11thdeg/cyan-next'

interface FilterPanelProps {
  sort?: Signal<string>
  sortOptions?: Record<string, string>
  filter?: Signal<string>
  filterOptions?: Record<string, string>
}

export const FilterPanel: Component<FilterPanelProps> = (props) => {
  function showFilterOptions(e: Event) {
    console.warn('show filter options')

    const filter = document.querySelector('.filter-options')
    if (filter) {
      filter.classList.toggle('hidden')
    }
  }

  function setSort(e: Event) {
    const button = e.target as HTMLButtonElement
    const value = button.value
    if (props.sort) {
      const [sort, setSort] = props.sort
      const originalSort = sort()
      const originalSortArray = originalSort.split(' ')
      if (originalSortArray[0] === value) {
        if (originalSortArray[1] === 'asc') {
          setSort(value + ' desc')
        } else {
          setSort(value + ' asc')
        }
      } else {
        setSort(value + ' asc')
      }
    }
  }

  function setFilter(e: Event) {
    console.warn('set filter', e, e.target)
    const pill = e.target as CnPill
    const checked = pill.checked ? true : false
    const value = pill.value

    console.warn('set filter', value, checked)

    if (props.filter) {
      const [filter, setFilter] = props.filter
      const originalFilter = filter()
      const filterArray =
        originalFilter.length > 0 ? originalFilter.split(';') : []
      if (checked) {
        filterArray.push(value)
      } else {
        const index = filterArray.indexOf(value)
        filterArray.splice(index, 1)
      }
      setFilter(filterArray.join(';'))
    }
  }

  return (
    <div class="filter-panel surface-44">
      <div class="toolbar flex">
        <button onclick={showFilterOptions}>
          <cn-icon noun="filter"></cn-icon>
        </button>
        <div style="flex: 1"></div>
        {props.sortOptions
          ? Object.keys(props.sortOptions).map((option) => (
              <button value={option} onclick={setSort}>
                {props.sortOptions ? props.sortOptions[option] : ''}
              </button>
            ))
          : ''}
      </div>
      {props.filterOptions ? (
        <div class="filter-options flex hidden border-radius border p-1">
          {Object.keys(props.filterOptions).map((option) => (
            <cn-pill
              value={option}
              label={props.filterOptions ? props.filterOptions[option] : ''}
              onchange={setFilter}
            ></cn-pill>
          ))}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
