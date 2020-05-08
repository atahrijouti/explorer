import { Explorer } from "../explorer"
import { NavigationBar } from "../navigation-bar"
import { AppEvent } from "./types"

import "./app.css"
import { rootFolder } from "./state"

export const appElement = document.getElementById("app")!

export function app() {
  NavigationBar()
  Explorer()

  appElement.dispatchEvent(
    new CustomEvent(AppEvent.FOLDER_CHANGED, {
      detail: rootFolder,
    })
  )
}
