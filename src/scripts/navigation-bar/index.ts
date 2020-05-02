import { state, rootFolder } from "../app/state"
import {
  renderExplorerNodes,
  rerenderSelectedNodes,
  explorer,
} from "../explorer"
import {
  findParents,
  createNewNode,
  deleteSelectedNodes,
} from "../database/queries"
import { NodeType } from "../app/types"

import "./navigation-bar.css"

export const goUp = document.getElementById("go-up")!
export const breadcrumb = document.getElementById("breadcrumb")!
export const newFolderBtn = document.getElementById("new-folder")!
export const newFileBtn = document.getElementById("new-file")!
export const deleteNodesBtn = document.getElementById("delete-nodes")!
export const renameBtn = document.getElementById("rename-node")!

export function NavigationBar() {
  //// Event Listeners
  goUp.addEventListener("click", navigateToParent, false)
  newFolderBtn.addEventListener(
    "click",
    () => createNewNode("New folder", NodeType.FOLDER),
    false
  )
  newFileBtn.addEventListener(
    "click",
    () => createNewNode("New file", NodeType.FILE),
    false
  )
  deleteNodesBtn.addEventListener("click", handleDeleteNodes, false)
  renameBtn.addEventListener("click", handleEditNode, false)
  document.addEventListener("keyup", handleKeyUp, false)

  //// ComponentDiMount
  renderBreadcrumb()

  // reflect state on delete and rename button on start-up
  if (state.selectedNodesIds.length > 0) {
    deleteNodesBtn.removeAttribute("disabled")
    state.selectedNodesIds.length === 1 && renameBtn.removeAttribute("disabled")
  }
}

export function renderBreadcrumb() {
  const breadcrumbItems = findParents(state.currentFolder)
  if (state.currentFolder !== rootFolder) {
    breadcrumbItems.push(state.currentFolder)
  }

  breadcrumb.innerHTML = breadcrumbItems.reduce((accumulator: string, node) => {
    return (
      accumulator + `<li data-id="${node.id}"><span>${node.name}</span></li>`
    )
  }, "")

  Array.from(breadcrumb.querySelectorAll("li")).forEach((node) =>
    node.addEventListener("click", respondToBreadcrumbClick)
  )
}

function handleDeleteNodes() {
  state.selectedNodesIds.forEach((id) => {
    explorer?.querySelector(`[data-id="${id}"]`)?.remove()
  })
  deleteNodesBtn.setAttribute("disabled", "disabled")
  deleteSelectedNodes()
}

function handleEditNode() {
  state.renaming = true
  rerenderSelectedNodes()
}

function respondToBreadcrumbClick(e: MouseEvent) {
  const currentTarget = <HTMLLIElement>e.currentTarget
  const rawId = currentTarget?.dataset.id
  if (rawId === "null") {
    goToRoot()
    return
  }

  const nextId = Number(currentTarget?.dataset.id)
  state.currentFolder =
    state.nodes.find((node) => node.id === nextId) ?? rootFolder
  renderExplorerNodes()
}

export function navigateToParent() {
  if (state.currentFolder.parentId === null) {
    if (state.currentFolder.id !== null) {
      goToRoot()
    }
  } else {
    state.currentFolder =
      state.nodes.find((node) => node.id === state.currentFolder.parentId) ??
      rootFolder
    renderExplorerNodes()
  }
}

function handleKeyUp(e: KeyboardEvent) {
  if (e.key === "F2") {
    handleEditNode()
  }
}

function goToRoot() {
  state.currentFolder = rootFolder
  renderExplorerNodes()
}
