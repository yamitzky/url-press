import { NextUIProvider } from "@nextui-org/react"
import type { LinksFunction } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react"
import "./tailwind.css"

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/favicon.ico",
      type: "image/x-icon"
    }
  ]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          <main className="font-sans text-foreground bg-background">
            {children}
          </main>
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
