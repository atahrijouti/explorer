import { renderExplorer } from "../explorer"
import { navigateToParent } from "../navigation-bar"
import { createNewNode } from "../database/queries"
import { TYPE } from "./types"

export const explorer = document.querySelector("#explorer")
export const goUp = document.getElementById("go-up")
export const breadcrumb = document.getElementById("breadcrumb")
export const newFolderBtn = document.getElementById("new-folder")
export const newFileBtn = document.getElementById("new-file")

export function app() {
  goUp.addEventListener("click", navigateToParent, false)
  newFolderBtn.addEventListener(
    "click",
    () => createNewNode("New folder", TYPE.FOLDER),
    false
  )
  newFileBtn.addEventListener(
    "click",
    () => createNewNode("New file", TYPE.FILE),
    false
  )
  renderExplorer()
}
