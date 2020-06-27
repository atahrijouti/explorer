import h from "hyperscript"

import folderImage from "~images/folder.png"
import fileImage from "~images/file.png"
import deleteFileImage from "~images/delete_file.png"
import renameFileImage from "~images/rename_file.png"

import { ControlButton } from "./control-button"

import "./navigation-bar.scss"
import { findParents } from "~pages/app/queries"
import {
  Node,
  NodeType,
  rootFolder,
  SelectionChange,
  setCurrentFolder,
  state,
} from "~pages/app/state"
import { AppEvent, dispatch } from "~pages/app/events"
import { appEmitter } from "~pages/app"
import { navigateTo } from "~router"

export function NavigationBar() {
  function renderBreadcrumb(currentFolder: Node) {
    const breadcrumbItems = findParents(currentFolder)
    if (state.currentFolder !== rootFolder) {
      breadcrumbItems.push(state.currentFolder)
    }

    breadcrumb.innerHTML = breadcrumbItems.reduce<string>((accumulator, node: Node) => {
      return accumulator + `<li data-id="${node.id}" tabindex="0"><span>${node.name}</span></li>`
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
      deleteNodeBtn,
      ControlButton({
        label: "home",
        image: folderImage,
        onclick: () => {
          navigateTo("/", "Home")
        },
      }),
      ControlButton({
        label: "settings",
        image: folderImage,
        onclick: () => {
          navigateTo("/settings", "Settings")
        },
      }),
      ControlButton({
        label: "test",
        image: folderImage,
        onclick: () => {
          navigateTo("/test", "Test")
        },
      }),
      ControlButton({
        label: "somewhere",
        image: folderImage,
        onclick: () => {
          navigateTo("/somewhere", "Somewhere")
        },
      })
    ),
    h("nav", { className: "navigation-bar" }, h("div", { className: "buttons" }, goUp), breadcrumb)
  )
}
