import { state, rootFolder, Node } from "../app/state"
import {
  explorer,
  renderExplorerNodes,
  rerenderSelectedNodes,
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

  breadcrumb.innerHTML = breadcrumbItems.reduce<string>(
    (accumulator, node: Node) => {
      return (
        accumulator + `<li data-id="${node.id}"><span>${node.name}</span></li>`
      )
    },
    ""
  )

  Array.from(breadcrumb.querySelectorAll("li")).forEach((node) =>
    node.addEventListener("click", respondToBreadcrumbClick)
  )
}

function handleDeleteNodes() {
  state.selectedNodesIds.forEach((id) => {
    explorer.querySelector(`[data-id="${id}"]`)?.remove()
  })
  deleteNodesBtn.setAttribute("disabled", "disabled")
  deleteSelectedNodes()
}

function handleEditNode() {
  state.renaming = true
  rerenderSelectedNodes()
}

function respondToBreadcrumbClick(e: MouseEvent) {
  const currentTarget = e.currentTarget as HTMLLIElement
  const rawId = currentTarget.dataset.id
  if (rawId === "null") {
    goToRoot()
    return
  }

  const nextId = Number(currentTarget.dataset.id)
  const clickedNode = state.nodes.find((node) => node.id === nextId)
  if (clickedNode == null) {
    // TODO : add 404
    return
  }
  state.currentFolder = clickedNode
  renderExplorerNodes()
}

export function navigateToParent() {
  if (state.currentFolder.parentId === null) {
    if (state.currentFolder.id !== null) {
      goToRoot()
    }
  } else {
    const clickedNode = state.nodes.find(
      (node) => node.id === state.currentFolder.parentId
    )
    if (clickedNode == null) {
      return
    }
    state.currentFolder = clickedNode
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
