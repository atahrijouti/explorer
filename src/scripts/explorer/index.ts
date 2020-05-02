import { state } from "../app/state"
import { Node, NodeType, CustomEvent } from "../app/types"
import { renderBreadcrumb, deleteNodesBtn, renameBtn } from "../navigation-bar"
import { NodeComponent } from "./components/node"

import "./explorer.scss"

export const explorer = document.querySelector("#explorer")!

export function Explorer() {
  renderExplorerNodes()
}

export function renderExplorerNodes() {
  const ul = document.createElement("ul")

  state.nodes.forEach((node) => {
    if (node.parentId === state.currentFolder.id) {
      ul.appendChild(buildNode(node))
    }
  })

  explorer.replaceChild(ul, explorer.querySelector("ul")!)

  renderBreadcrumb()
}

/**
 * Re-Render nodes identified by a set of nodeIds
 * @param {number[]} nodeIds
 */
export function renderSpecificExplorerNodes(nodeIds: number[]) {
  // generate selector to select all existing dom nodes based on nodeIds
  const selector = nodeIds.map((id) => `[data-id="${id}"]`).join(",")
  const selectedDomNodes = Array.from(
    explorer.querySelectorAll(selector)
  ) as Array<HTMLLIElement>

  selectedDomNodes.forEach((currentNodeDom: HTMLLIElement) => {
    const id = Number(currentNodeDom.dataset.id)
    const node = state.nodes.find((n) => n.id === id)!
    const newNodeDom = buildNode(node)
    explorer.querySelector("ul")!.replaceChild(newNodeDom, currentNodeDom)
    // when newNodeDom has been mounted, trigger MOUNTED event on newNodeDom
    // so that newNodeDom also knows that it was mounted
    if (newNodeDom.listensToMount) {
      newNodeDom.dispatchEvent(new Event(CustomEvent.MOUNTED))
    }
  })
}

export function rerenderSelectedNodes() {
  renderSpecificExplorerNodes(state.selectedNodesIds)
}

function handleInputKeyUp(node, e) {
  if (e.key === "Enter") {
  }
  switch (e.key) {
    case "Enter":
      node.name = e.currentTarget.value
      state.renaming = false
      rerenderSelectedNodes()
      break
    case "Escape":
      state.renaming = false
      rerenderSelectedNodes()
      break
    default:
      return true
  }
}

function buildNode(node: Node) {
  const selected = state.selectedNodesIds.find((n) => n === node.id) != null
  return NodeComponent({
    node,
    onDblClick: handleNodeDblClick,
    onClick: handleNodeClick,
    selected,
    renaming: state.renaming && selected,
    onKeyUp: handleInputKeyUp,
  })
}

function handleNodeDblClick(node, e) {
  if (e.target.classList.contains("rename")) {
    return
  }
  const nextId = node.id
  const clickedNode = state.nodes.find((node) => node.id === nextId)
  if (clickedNode.type === NodeType.FOLDER) {
    state.currentFolder = clickedNode
    renderExplorerNodes()
  } else {
    console.log(`${clickedNode.name} is a file : OPEN`)
  }
  deleteNodesBtn.removeAttribute("disabled")
  state.selectedNodesIds.length === 1 && renameBtn.removeAttribute("disabled")
  state.renaming = false
}

function handleNodeClick(node, e) {
  if (e.target.classList.contains("rename")) {
    return
  }
  const previousSelection = [...state.selectedNodesIds]

  if (state.selectedNodesIds.find((id) => id === node.id)) {
    state.selectedNodesIds = []
    deleteNodesBtn.setAttribute("disabled", "disabled")
    renameBtn.setAttribute("disabled", "disabled")
  } else {
    state.selectedNodesIds = [node.id]
    deleteNodesBtn.removeAttribute("disabled")
    state.selectedNodesIds.length === 1 && renameBtn.removeAttribute("disabled")
    state.renaming = false
  }

  renderSpecificExplorerNodes([...previousSelection, ...state.selectedNodesIds])
}
