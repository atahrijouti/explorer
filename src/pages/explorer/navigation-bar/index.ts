import h from "hyperscript"

import folderImage from "~images/folder.png"
import fileImage from "~images/file.png"
import deleteFileImage from "~images/delete_file.png"
import renameFileImage from "~images/rename_file.png"

import { ControlButton } from "./control-button"

import "./navigation-bar.scss"
import { browseFolder, Node, rootFolder, SelectionChange, state } from "~pages/explorer/state"
import { AppEvent, dispatch } from "~pages/explorer/events"
import { appEmitter } from "~pages/explorer"
import { NodeType } from "~pages/explorer/types"

export function NavigationBar() {
  function renderBreadcrumb() {
    breadcrumb.innerHTML = ""
    state.breadcrumb.forEach((breadcrumbNode) => {
      breadcrumb.appendChild(
        h(
          "li",
          {
            tabindex: 0,
            ["onclick"]: () => {
              respondToBreadcrumbClick(breadcrumbNode)
            },
          },
          h("span", breadcrumbNode.name)
        )
      )
    })
  }

  function handleDeleteNodes() {
    dispatch(appEmitter, AppEvent.REMOVE_NODES)
  }

  function handleEditNode() {
    dispatch(appEmitter, AppEvent.RENAME_NODE)
  }

  function handleFolderChanged(e: Event) {
    const folder = (e as CustomEvent<Node>).detail
    renderBreadcrumb()
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

  function respondToBreadcrumbClick(node: Node) {
    if (node.id === rootFolder.id) {
      goToRoot()
      return
    }

    browseFolder(node)
  }

  function navigateToParent() {
    if (state.currentFolder.parentId === null) {
      if (state.currentFolder.id !== null) {
        goToRoot()
      }
    } else {
      const parent = state.breadcrumb.find(
        (breadcrumNode) => breadcrumNode.id === state.currentFolder.parentId
      )
      if (parent == null) {
        return
      }
      browseFolder(parent)
    }
  }

  function goToRoot() {
    browseFolder(rootFolder)
  }

  const goUp = h("button", "🡱", { className: "go-up" })
  const breadcrumb = h("ul", { className: "breadcrumb" })

  const newFolderBtn = ControlButton({ label: "New Folder", image: folderImage })
  const newFileBtn = ControlButton({ label: "New File", image: fileImage })
  const renameNodeBtn = ControlButton({ label: "Rename", image: renameFileImage })
  const deleteNodeBtn = ControlButton({ label: "Delete", image: deleteFileImage })

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
