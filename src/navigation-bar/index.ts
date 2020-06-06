import { Node, rootFolder, SelectionChange, setCurrentFolder, state } from "~app/state"
import { findParents } from "~database/queries"
import { AppEvent, NodeType } from "~app/types"

import "./navigation-bar.css"
import { appElement } from "~app"
import { dispatch } from "~app/helpers"

export const goUp = document.getElementById("go-up") as HTMLButtonElement
export const breadcrumb = document.getElementById("breadcrumb") as HTMLButtonElement
export const newFolderBtn = document.getElementById("new-folder") as HTMLButtonElement
export const newFileBtn = document.getElementById("new-file") as HTMLButtonElement
export const deleteNodeBtn = document.getElementById("delete-nodes") as HTMLButtonElement
export const renameNodeBtn = document.getElementById("rename-node") as HTMLButtonElement

export function NavigationBar() {
  //// Event Listeners
  goUp.addEventListener("click", navigateToParent, false)
  newFolderBtn.addEventListener("click", () =>
    dispatch(appElement, AppEvent.CREATE_NODE, NodeType.FOLDER)
  )
  newFileBtn.addEventListener("click", () =>
    dispatch(appElement, AppEvent.CREATE_NODE, NodeType.FILE)
  )
  deleteNodeBtn.addEventListener("click", handleDeleteNodes, false)
  renameNodeBtn.addEventListener("click", handleEditNode, false)
  appElement.addEventListener(AppEvent.FOLDER_CHANGED, handleFolderChanged)
  appElement.addEventListener(AppEvent.SELECTION_CHANGED, handleSelectionChanged)
}

export function renderBreadcrumb(currentFolder: Node) {
  const breadcrumbItems = findParents(currentFolder)
  if (state.currentFolder !== rootFolder) {
    breadcrumbItems.push(state.currentFolder)
  }

  breadcrumb.innerHTML = breadcrumbItems.reduce<string>((accumulator, node: Node) => {
    return accumulator + `<li data-id="${node.id}"><span>${node.name}</span></li>`
  }, "")

  Array.from(breadcrumb.querySelectorAll("li")).forEach((node) =>
    node.addEventListener("click", respondToBreadcrumbClick)
  )
}

function handleDeleteNodes() {
  dispatch(appElement, AppEvent.REMOVE_NODES)
}

function handleEditNode() {
  dispatch(appElement, AppEvent.RENAME_NODE)
}

function handleFolderChanged(e: Event) {
  const folder = (e as CustomEvent<Node>).detail
  renderBreadcrumb(folder)
  if (folder.id === null) {
    goUp.setAttribute("disabled", "disabled")
  } else {
    goUp.removeAttribute("disabled")
  }
}

function handleSelectionChanged(e: Event) {
  const [selectedIds] = (e as CustomEvent<SelectionChange>).detail
  if (selectedIds.length == 1) {
    deleteNodeBtn.removeAttribute("disabled")
    renameNodeBtn.removeAttribute("disabled")
  } else {
    deleteNodeBtn.setAttribute("disabled", "disabled")
    renameNodeBtn.setAttribute("disabled", "disabled")
  }
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
    console.log("404 NOT FOUND")
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
    const clickedNode = state.nodes.find((node) => node.id === state.currentFolder.parentId)
    if (clickedNode == null) {
      return
    }
    setCurrentFolder(clickedNode)
  }
}

function goToRoot() {
  setCurrentFolder(rootFolder)
}
