import { Settings } from "~pages/settings"
import { Test } from "~pages/test"
import { App } from "~pages/app"

export const Routes = [
    {
    pattern: /^settings/,
    component: Settings,
  },
    {
    pattern: /^test/,
    component: Test,
  },
  {
    pattern: /.*/,
    component: App,
  },
]
