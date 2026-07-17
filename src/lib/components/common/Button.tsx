import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

type ButtonVariant =
  | 'primary' | 'secondary' | 'disabled' | 'white' | 'custom-3'
  | 'whatsapp' | 'email' | 'github' | 'hackerrank' | 'instagram'
  | 'facebook' | 'linkedIn' | 'medium' | 'telegram' | 'x'
  | 'codeforces' | 'gitlab' | 'threads'

interface ButtonBaseProps {
  variant?: ButtonVariant
  fullWidth?: boolean
  small?: boolean
  children: ReactNode
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsLink

const baseStyles =
  'px-4 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center gap-2'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:opacity-90',
  secondary: 'bg-secondary text-white hover:opacity-90',
  disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  white: 'bg-white text-black hover:bg-gray-100',
  'custom-3': 'bg-custom-3 text-white hover:opacity-90',
  whatsapp: 'bg-green-600 text-white hover:bg-green-700',
  email: 'bg-blue-500 text-white hover:bg-blue-600',
  github: 'bg-gray-800 text-white hover:bg-gray-900',
  hackerrank: 'bg-green-500 text-white hover:bg-green-600',
  instagram: 'bg-pink-600 text-white hover:bg-pink-700',
  facebook: 'bg-blue-600 text-white hover:bg-blue-700',
  linkedIn: 'bg-blue-700 text-white hover:bg-blue-800',
  medium: 'bg-gray-900 text-white hover:bg-black',
  telegram: 'bg-blue-400 text-white hover:bg-blue-500',
  x: 'bg-black text-white hover:bg-gray-900',
  codeforces: 'bg-blue-800 text-white hover:bg-blue-900',
  gitlab: 'bg-orange-600 text-white hover:bg-orange-700',
  threads: 'bg-black text-white hover:bg-gray-900',
}

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    fullWidth,
    small,
    children,
    ...rest
  } = props

  const classes = [
    baseStyles,
    variantStyles[variant],
    fullWidth ? 'w-full' : '',
    small ? 'text-sm px-3 py-1.5' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if ('href' in rest) {
    const { href, ...anchorRest } = rest as Record<string, unknown>
    return (
      <a href={href as string} className={classes} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button
      className={classes}
      disabled={variant === 'disabled'}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
