import type { IconUrl, NonEmptyArray } from './_common'
import type { Opaque } from './opaque'

// Full-qualified-name
export type Fqn = Opaque<string, 'Fqn'>

export function AsFqn(name: string, parent?: Fqn | null) {
  return (parent ? parent + '.' + name : name) as Fqn
}

export type ElementKind = Opaque<string, 'ElementKind'>

/**
 * TailwindCSS based color palette
 */
export type ThemeColor =
  | 'amber'
  | 'blue'
  | 'gray'
  | 'slate'
  | 'green'
  | 'indigo'
  | 'muted'
  | 'primary'
  | 'red'
  | 'secondary'
  | 'sky'
export type ElementShape =
  | 'rectangle'
  | 'person'
  | 'browser'
  | 'mobile'
  | 'cylinder'
  | 'storage'
  | 'queue'

export const DefaultThemeColor: ThemeColor = 'primary'
export const DefaultElementShape: ElementShape = 'rectangle'

export interface ElementStyle {
  shape?: ElementShape
}

export type Tag = Opaque<string, 'Tag'>

export interface TagSpec {
  readonly id: Tag
  readonly style: ElementStyle
}

export interface Element {
  readonly id: Fqn
  readonly kind: ElementKind
  readonly title: string
  readonly description: string | null
  readonly technology: string | null
  readonly tags: NonEmptyArray<Tag> | null
  readonly links: NonEmptyArray<string> | null
  readonly icon?: IconUrl
  readonly shape?: ElementShape
  readonly color?: ThemeColor
}
