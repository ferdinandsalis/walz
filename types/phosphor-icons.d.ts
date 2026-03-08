// Type declarations for @phosphor-icons/react under moduleResolution: "nodenext"
// The package's ESM types don't resolve correctly with nodenext because
// internal re-exports from ./csr/*.d.ts lack .d.mts counterparts.

declare module '@phosphor-icons/react' {
  import type { ComponentType, SVGAttributes } from 'react'

  interface IconProps extends SVGAttributes<SVGSVGElement> {
    size?: string | number
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
    mirrored?: boolean
    color?: string
  }

  type Icon = ComponentType<IconProps>

  export const ArrowLeft: Icon
  export const ArrowRight: Icon
  export const ArrowSquareOut: Icon
  export const Asterisk: Icon
  export const Baby: Icon
  export const BookBookmark: Icon
  export const BookOpen: Icon
  export const Calendar: Icon
  export const CalendarDots: Icon
  export const Camera: Icon
  export const CaretDown: Icon
  export const CaretUp: Icon
  export const ChatCircleText: Icon
  export const ChatText: Icon
  export const CheckSquare: Icon
  export const CircleNotch: Icon
  export const Clipboard: Icon
  export const CurrencyEur: Icon
  export const DownloadSimple: Icon
  export const Envelope: Icon
  export const GraduationCap: Icon
  export const Handshake: Icon
  export const House: Icon
  export const Info: Icon
  export const InstagramLogo: Icon
  export const Link: Icon
  export const LinkSimple: Icon
  export const List: Icon
  export const MagnifyingGlassPlus: Icon
  export const Microphone: Icon
  export const Newspaper: Icon
  export const Phone: Icon
  export const Question: Icon
  export const Quotes: Icon
  export const Smiley: Icon
  export const Trophy: Icon
  export const User: Icon
  export const Users: Icon
  export const X: Icon
  export const YoutubeLogo: Icon
}
