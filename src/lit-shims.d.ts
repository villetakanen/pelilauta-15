import {
  CnCard,
  CnIcon,
  CnNavigationIcon,
  CnAvatarButton,
  CnBubble,
  CnAvatar,
  CnReactionButton,
  CnDialog,
} from '@11thdeg/cyan-next'
declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'cn-icon': HTMLAttributes & { noun: string }
      'cn-card': HTMLAttributes
      'cn-dialog': HTMLAttributes
      'cn-navigation-icon': HTMLAttributes & { noun: string; label: string }
      'cn-avatar-button': HTMLAttributes & { src: string }
      'cn-avatar': CnAvatar
      'cn-bubble': HTMLAttributes
      'cn-reaction-button': CnReactionButton
      'cn-loader': HTMLAttributes
      'cn-pill': HTMLAttributes & {
        label: string
        noun: string
        checked: boolean
        value: string
      }
    }
  }
}
