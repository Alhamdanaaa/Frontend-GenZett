import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'

const fontSans = Poppins({
  subsets: ['latin'],
  weight: ['100','200', '300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const fontVariables = cn(fontSans.variable)