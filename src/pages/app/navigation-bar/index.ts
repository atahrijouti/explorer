import { Node, NodeType, rootFolder, SelectionChange, setCurrentFolder, state } from "~pages/app/state"
import { findParents } from "~pages/app/queries"
import { AppEvent, dispatch } from "~pages/app/events"

import "./navigation-bar.css"
import h from "hyperscript"
import { appEmitter } from "~pages/app"

export function NavigationBar() {
  function renderBreadcrumb(currentFolder: Node) {
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
    dispatch(appEmitter, AppEvent.REMOVE_NODES)
  }

  function handleEditNode() {
    dispatch(appEmitter, AppEvent.RENAME_NODE)
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

  function navigateToParent() {
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

  const goUp = h("button", "⬆️")
  const breadcrumb = h("ul", { className: "breadcrumb" })
  const newFolderBtn = h("button", "New Folder")
  const newFileBtn = h("button", "New File")
  const renameNodeBtn = h("button", { disabled: true }, "Rename")
  const deleteNodeBtn = h("button", { disabled: true }, "Delete")

  //// Event Listeners
  goUp.addEventListener("click", navigateToParent, false)
  newFolderBtn.addEventListener("click", () =>
    dispatch(appEmitter, AppEvent.CREATE_NODE, NodeType.FOLDER)
  )
  newFileBtn.addEventListener("click", () =>
    dispatch(appEmitter, AppEvent.CREATE_NODE, NodeType.FILE)
  )
  deleteNodeBtn.addEventListener("click", handleDeleteNodes, false)
  renameNodeBtn.addEventListener("click", handleEditNode, false)
  appEmitter.addEventListener(AppEvent.FOLDER_CHANGED, handleFolderChanged)
  appEmitter.addEventListener(AppEvent.SELECTION_CHANGED, handleSelectionChanged)

  return h(
    "header",
    h("nav", { className: "navigation-bar" }, h("div", { className: "buttons" }, goUp), breadcrumb),
    h(
      "section",
      { className: "controls-bar" },
      newFolderBtn,
      newFileBtn,
      renameNodeBtn,
      deleteNodeBtn
    )
  )
}
