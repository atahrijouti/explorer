import { Node, rootFolder, SelectionChange, setCurrentFolder, state } from "~app/state"
import { findParents } from "~database/queries"
import { AppEvent, NodeType } from "~app/types"

import "./navigation-bar.css"
import { dispatch } from "~app/helpers"
import h from "hyperscript"
import { appEmitter } from "~app"
import folderImage from "~images/folder.png"
import fileImage from "~images/file.png"
import deleteFileImage from "~images/delete_file.png"
import renameFileImage from "~images/rename_file.png"

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

  const goUp = h("button", "🡱", { className: "go-up" })
  const breadcrumb = h("ul", { className: "breadcrumb" })
  const newFolderBtn = h(
    "button",
    { className: "control-button" },
    h("img", { src: folderImage }),
    h("span", "New"),
    h("br"),
    h("span", "Folder")
  )
  const newFileBtn = h(
    "button",
    { className: "control-button" },
    h("img", { src: fileImage }),
    h("span", "New"),
    h("br"),
    h("span", "File")
  )
  const renameNodeBtn = h(
    "button",
    { className: "control-button" },
    h("img", { src: renameFileImage }),
    h("span", "Rename")
  )
  const deleteNodeBtn = h(
    "button",
    { className: "control-button" },
    h("img", { src: deleteFileImage }),
    h("span", "Delete")
  )

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
    h(
      "section",
      { className: "controls-bar" },
      newFolderBtn,
      newFileBtn,
      renameNodeBtn,
      deleteNodeBtn
    ),
    h("nav", { className: "navigation-bar" }, h("div", { className: "buttons" }, goUp), breadcrumb)
  )
}
