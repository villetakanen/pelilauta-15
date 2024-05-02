import type { Component, Signal } from "solid-js";

interface FilterPanelProps {
  sort?: Signal<string>,
  sortOptions?: Record<string, string>,
  filter?: Signal<string>,
  filterOptions?: Record<string, string>,
}

export const FilterPanel:Component<FilterPanelProps> = (props) => {


  function showFilterOptions(e: Event) {
    console.warn('show filter options')

    const filter = document.querySelector('.filter-options')
    if (filter) {
      filter.classList.toggle('hidden')
    }
  }

  return (
    <div class="filter-panel surface-44">
      <div class="toolbar flex">
        <button onclick={showFilterOptions}>
          <cn-icon noun="filter"></cn-icon>
        </button>
        <div style="flex: 1"></div>
        { props.sortOptions ? Object.keys(props.sortOptions).map((option) => (
            <button>{props.sortOptions ? props.sortOptions[option] : ''}</button>
         )) : '' }
      </div>
      { props.filterOptions ? (
        <div class="filter-options flex hidden border-radius border p-1">
          { Object.keys(props.filterOptions).map((option) => (
            <cn-pill label={props.filterOptions ? props.filterOptions[option] : ''}></cn-pill>
          ))}
        </div>
      ) : ''}
    </div>
  )
}