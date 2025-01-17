import type { CSSProperties, HTMLAttributes } from 'react'

// prettier
const ContainerStyles = {
  position: 'absolute',
  pointerEvents: 'none',
  userSelect: 'none',
  top: 0,
  left: 0,
  width: '100%',
  margin: 0,
  padding: '10px 20px 0 20px',
  boxSizing: 'border-box',
  color: 'rgb(241 245 249 / 95%)',
  fontFamily: 'ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif',
  fontSize: '16px',
  lineHeight: '1.1',
  fontWeight: '500',
  textShadow: '4px 4px 5px rgb(17 17 17)'
} satisfies CSSProperties

export interface FullscreenDiagramTitleProps extends HTMLAttributes<HTMLDivElement> {}

export function FullscreenDiagramTitle({ children, style, ...props }: FullscreenDiagramTitleProps) {
  return (
    <div
      style={{
        ...ContainerStyles,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}
FullscreenDiagramTitle.displayName = 'FullscreenDiagramTitle'
