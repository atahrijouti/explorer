import h from "hyperscript"
import { Explorer } from "~explorer"
import { NavigationBar } from "~navigation-bar"

import { rootFolder, setCurrentFolder } from "./state"
import "./app.css"

export let appElement: HTMLElement | null = null

export function App(rootElement: HTMLElement) {
  appElement = h<HTMLDivElement>("div.app")
  rootElement.appendChild(appElement)
  appElement.appendChild(NavigationBar(appElement))
  appElement.appendChild(Explorer(appElement))

  //////////
  // this also takes care of updating the explorer nodes that are rendered
  setCurrentFolder(rootFolder)
}
