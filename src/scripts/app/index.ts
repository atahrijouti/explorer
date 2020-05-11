import { Explorer } from "../explorer"
import { NavigationBar } from "../navigation-bar"
import { AppEvent } from "./types"
import { rootFolder } from "./state"
import { dispatch } from "./helpers"

import "./app.css"

export const appElement = document.getElementById("app")!

export function App() {
  NavigationBar()
  Explorer()

  //////////
  // App has been setup, time to trigger AppEvent.FOLDER_CHANGED
  dispatch(appElement, AppEvent.FOLDER_CHANGED, rootFolder)
}
