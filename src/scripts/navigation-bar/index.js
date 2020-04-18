import { state, rootFolder } from "../app/state"
import { renderExplorerNodes } from "../explorer"
import { findParents, createNewNode } from "../database/queries"
import { TYPE } from "../app/types"

export const newFolderBtn = document.getElementById("new-folder")
export const newFileBtn = document.getElementById("new-file")
export const goUp = document.getElementById("go-up")
export const breadcrumb = document.getElementById("breadcrumb")

export function Breadcrumb() {
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
  renderBreadcrumb()
}

export function renderBreadcrumb() {
  const breadcrumbItems = findParents(state.currentFolder)
  if (state.currentFolder !== rootFolder) {
    breadcrumbItems.push(state.currentFolder)
  }

  breadcrumb.innerHTML = breadcrumbItems.reduce((accumulator, node) => {
    return (
      accumulator + `<li data-id="${node.id}"><span>${node.name}</span></li>`
    )
  }, "")

  Array.from(breadcrumb.querySelectorAll("li")).forEach((node) =>
    node.addEventListener("click", respondToBreadcrumbClick)
  )
}

function respondToBreadcrumbClick(e) {
  const rawId = e.currentTarget.dataset.id
  if (rawId === "null") {
    goToRoot()
    return
  }

  const nextId = Number(e.currentTarget.dataset.id)
  state.currentFolder = state.nodes.find((node) => node.id === nextId)
  renderExplorerNodes()
}

export function navigateToParent() {
  if (state.currentFolder.parentId === null) {
    if (state.currentFolder.id !== null) {
      goToRoot()
    }
  } else {
    state.currentFolder = state.nodes.find(
      (node) => node.id === state.currentFolder.parentId
    )
    renderExplorerNodes()
  }
}

function goToRoot() {
  state.currentFolder = rootFolder
  renderExplorerNodes()
}
