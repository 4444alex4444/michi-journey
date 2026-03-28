import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Michi Journey · 道',
  description: 'Твой тихий путь к японскому и Японии',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
