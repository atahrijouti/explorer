import {
  state,
  rootFolder,
  Node,
  setCurrentFolder,
  setSelectedNodeIds,
  SelectionChange,
} from "~app/state"
import { buildNode, explorer, renderSpecificExplorerNodes } from "~explorer"
import {
  findParents,
  storeNewNode,
  deleteSelectedNodes,
} from "~database/queries"
import { AppEvent, NodeType } from "~app/types"

import "./navigation-bar.css"
import { appElement } from "~app"
import { dispatch } from "~app/helpers"

export const goUp = document.getElementById("go-up")!
export const breadcrumb = document.getElementById("breadcrumb")!
export const newFolderBtn = document.getElementById("new-folder")!
export const newFileBtn = document.getElementById("new-file")!
export const deleteNodeBtn = document.getElementById("delete-nodes")!
export const renameNodeBtn = document.getElementById("rename-node")!

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
  deleteNodeBtn.addEventListener("click", handleDeleteNodes, false)
  renameNodeBtn.addEventListener("click", handleEditNode, false)
  document.addEventListener("keyup", handleKeyUp, false)
  appElement.addEventListener(AppEvent.FOLDER_CHANGED, handleFolderChanged)
  appElement.addEventListener(
    AppEvent.SELECTION_CHANGED,
    handleSelectionChanged
  )
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

function createNewNode(name: string, type: NodeType) {
  unselectSelectedNodes()
  const node = storeNewNode(name, type)
  appendNode(node)
}

function unselectSelectedNodes() {
  const previousSelection = [...state.selectedNodeIds]
  // TODO : investigate a better approach for not triggering selection changed event twice
  state.selectedNodeIds = []
  renderSpecificExplorerNodes(previousSelection)
}

function appendNode(node: Node) {
  const domNode = buildNode(node)
  explorer.querySelector("ul")!.appendChild(domNode)
  dispatch(domNode, AppEvent.MOUNTED)
}

function handleDeleteNodes() {
  state.selectedNodeIds.forEach((id) => {
    explorer.querySelector(`[data-id="${id}"]`)?.remove()
  })
  deleteNodeBtn.setAttribute("disabled", "disabled")
  setSelectedNodeIds([])
  deleteSelectedNodes()
}

function handleEditNode() {
  // TODO : Make sure not to get into renaming mode when nothing is selected
  state.isRenaming = true
  dispatch(appElement, AppEvent.SELECTION_CHANGED, [
    state.selectedNodeIds,
    state.selectedNodeIds,
  ])
}

function handleFolderChanged(e: Event) {
  renderBreadcrumb((e as CustomEvent<Node>).detail)
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
