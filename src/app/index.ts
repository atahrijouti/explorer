import h from "hyperscript"

import { Explorer } from "~explorer"
import { NavigationBar } from "~navigation-bar"

import { rootFolder, setCurrentFolder } from "./state"
import "./app.css"
import { AppEvent } from "~app/types"

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
