import h from "hyperscript"

import { NodeList } from "~pages/explorer/node-list"
import { AppEvent } from "~pages/explorer/events"
import { NavigationBar } from "~pages/explorer/navigation-bar"

import { browserFolder, rootFolder } from "./state"
import "./explorer.css"

export const appEmitter = new EventTarget()

export function ExplorerPage() {
  return h(
    "div",
    {
      className: "explorer",
      [`on${AppEvent.MOUNTED}`]: () => {
        console.log("mounted app")
        browserFolder(rootFolder)
      },
      [`on${AppEvent.UNMOUNTED}`]: () => {
        console.log("unmounted app")
      },
    },
    NavigationBar(),
    NodeList()
  )
}
