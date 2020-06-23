import h from "hyperscript"

import { Explorer } from "~pages/app/explorer"
import { AppEvent } from "~pages/app/events"
import { NavigationBar } from "~pages/app/navigation-bar"

import { rootFolder, setCurrentFolder } from "./state"
import "./app.css"

export const appEmitter = new EventTarget()

export function App() {
  return h(
    "div",
    {
      className: "app",
      [`on${AppEvent.MOUNTED}`]: () => {
        setCurrentFolder(rootFolder)
      },
    },
    NavigationBar(),
    Explorer()
  )
}
