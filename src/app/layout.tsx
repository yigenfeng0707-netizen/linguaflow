import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinguaFlow - 多语种在线教育平台',
  description: '沉浸式语言学习体验，支持英语、日语、韩语等主流语言学习',
  keywords: ['语言学习', '在线教育', '英语学习', '日语学习', '韩语学习', '多语种'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
