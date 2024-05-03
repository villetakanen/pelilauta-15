/**
 * A button for selecting media from the library. Opens a modal to select media, and returns an array of url's
 * to the selected media.
 *
 * @param {string} [label] - The label for the button, omit if none
 * @param {string} [mediatype] - The type of media to select, defaults to 'image'
 */

import type { Component } from 'solid-js'
import { CnDialog } from '@11thdeg/cyan-next'

export const SelectMediaButton: Component<{
  label?: string
  mediatype?: string
}> = (props) => {
  function handleSelectMedia() {
    console.log('Selecting media')
    const dialog = document.getElementById('assetDialog') as CnDialog
    dialog.showModal()
  }

  return (
    <button class="text">
      <cn-icon noun="assets" onclick={handleSelectMedia} />
      {props.label ? <span>{props.label}</span> : ''}
      <cn-dialog id="assetDialog"></cn-dialog>
    </button>
  )
}
