import { state, rootFolder, Node, setCurrentFolder } from "../app/state"
import {
  explorer,
  reRenderSelectedNodes,
} from "../explorer"
import {
  findParents,
  createNewNode,
  deleteSelectedNodes,
} from "../database/queries"
import { AppEvent, NodeType } from "../app/types"

import "./navigation-bar.css"
import { appElement } from "../app"

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
  appElement.addEventListener(AppEvent.FOLDER_CHANGED, (e) => {
    renderBreadcrumb((e as CustomEvent<Node>).detail)
  })

  // reflect state on delete and rename button on start-up
  if (state.selectedNodesIds.length > 0) {
    deleteNodesBtn.removeAttribute("disabled")
    state.selectedNodesIds.length === 1 && renameBtn.removeAttribute("disabled")
  }
}

export function renderBreadcrumb(currentFolder: Node) {
  const breadcrumbItems = findParents(currentFolder)
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
  // TODO : Make sure not to get into renaming mode when nothing is selected
  state.renaming = true
  reRenderSelectedNodes()
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
  setCurrentFolder(clickedNode)
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
    setCurrentFolder(clickedNode)
  }
}

function handleKeyUp(e: KeyboardEvent) {
  if (e.key === "F2") {
    handleEditNode()
  }
}

function goToRoot() {
  setCurrentFolder(rootFolder)
}
