import { breadcrumb } from "../app"
import { state, rootFolder } from "../app/state"
import { renderExplorer } from "../explorer"
import { findParents } from "../database/queries"

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

function respondToBreadcrumbClick(e) {
  const rawId = e.currentTarget.dataset.id
  if (rawId === "null") {
    goToRoot()
    return
  }

  const nextId = Number(e.currentTarget.dataset.id)
  state.currentFolder = state.nodes.find((node) => node.id === nextId)
  renderExplorer()
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
    renderExplorer()
  }
}

function goToRoot() {
  state.currentFolder = rootFolder
  renderExplorer()
}
