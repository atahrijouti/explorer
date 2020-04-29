import { state, rootFolder } from "../app/state"
import { renderExplorerNodes, rerenderSelectedNodes } from "../explorer"
import {
  findParents,
  createNewNode,
  deleteSelectedNodes,
} from "../database/queries"
import { TYPE } from "../app/types"

import "./navigation-bar.css"

export const goUp = document.getElementById("go-up")
export const breadcrumb = document.getElementById("breadcrumb")
export const newFolderBtn = document.getElementById("new-folder")
export const newFileBtn = document.getElementById("new-file")
export const deleteNodesBtn = document.getElementById("delete-nodes")
export const renameBtn = document.getElementById("rename-node")

export function NavigationBar() {
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
  deleteNodesBtn.addEventListener("click", handleDeleteNodes, false)
  renameBtn.addEventListener("click", handleEditNode, false)
  document.addEventListener("keyup", e => {
    if (e.key !== 'F2') {
      return;
    }
    handleEditNode()
  }, false)
  renderBreadcrumb()
  if (state.selectedNodesIds.length > 0) {
    deleteNodesBtn.removeAttribute("disabled")
    state.selectedNodesIds.length === 1 &&
      renameBtn.removeAttribute("disabled")
  }
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

function handleDeleteNodes() {
  state.selectedNodesIds.forEach((id) => {
    explorer.querySelector(`[data-id="${id}"]`).remove()
  })
  deleteNodesBtn.setAttribute("disabled", "disabled")
  deleteSelectedNodes()
}

function handleEditNode() {
  state.renaming = true
  rerenderSelectedNodes()
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
