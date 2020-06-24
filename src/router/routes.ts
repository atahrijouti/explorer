import { Settings } from "~pages/settings"
import { Test } from "~pages/test"
import { App } from "~pages/app"

type RouteConfig = {
  pattern: RegExp
  component: () => HTMLElement
}

export const ROUTES: readonly RouteConfig[] = [
  {
    pattern: /^settings$/,
    component: Settings,
  },
  {
    pattern: /^test$/,
    component: Test,
  },
  {
    pattern: /.*/,
    component: App,
  },
]
