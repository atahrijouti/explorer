import h from "hyperscript"

import { NodeList } from "~pages/explorer/node-list"
import { AppEvent } from "~pages/explorer/events"
import { NavigationBar } from "~pages/explorer/navigation-bar"

import { browseFolder, rootFolder, state } from "./state"
import "./explorer.css"
import { findNodeFromPath } from "~pages/explorer/queries"

export const appEmitter = new EventTarget()

export function ExplorerPage() {
  return h(
    "div",
    {
      className: "explorer",
      [`on${AppEvent.MOUNTED}`]: async () => {
        const result = await findNodeFromPath()
        if (!result) {
          await browseFolder(rootFolder)
        } else {
          state.breadcrumb = result.breadcrumb
          state.currentFolder = result.node
          await browseFolder(state.currentFolder)
        }
      },
      [`on${AppEvent.UNMOUNTED}`]: () => {},
    },
    NavigationBar(),
    NodeList()
  )
}
