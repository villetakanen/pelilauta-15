import type { Component } from 'solid-js'
import { t } from 'src/utils/i18n'

export const LoadingCard: Component = (props) => {
  return (
    <div class="loadingCard">
      <cn-loader></cn-loader>
      <div>{t('app:loading')}</div>
    </div>
  )
}
