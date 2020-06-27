import h from "hyperscript"

import { Explorer } from "~pages/app/explorer"
import { AppEvent } from "~pages/app/events"
import { NavigationBar } from "~pages/app/navigation-bar"

import { rootFolder, setCurrentFolder } from "./state"
import "./app.css"

export const appEmitter = new EventTarget()

export function AppPage() {
  return h(
    "div",
    {
      className: "app",
      [`on${AppEvent.MOUNTED}`]: () => {
        console.log("mounted app")
        setCurrentFolder(rootFolder)
      },
      [`on${AppEvent.UNMOUNTED}`]: () => {
        console.log("unmounted app")
      },
    },
    NavigationBar(),
    Explorer()
  )
}
