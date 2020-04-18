import { state } from "../app/state"
import { TYPE } from "../app/types"
import { renderBreadcrumb } from "../navigation-bar"
import { NodeComponent } from "./components/node"

import "./explorer.scss"

export const explorer = document.querySelector("#explorer")

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

  explorer.replaceChild(ul, explorer.querySelector("ul"))

  renderBreadcrumb()
}

function updateExplorerNodes(nodeIds) {
  const selector = nodeIds.map((id) => `[data-id="${id}"]`).join(",")
  explorer.querySelectorAll(selector).forEach((domNode) => {
    const id = Number(domNode.dataset.id)
    const node = state.nodes.find((n) => n.id === id)
    explorer.querySelector("ul").replaceChild(buildNode(node), domNode)
  })
}

function buildNode(node) {
  const selected = state.selectedNodesIds.find((n) => n === node.id) != null
  return NodeComponent({
    node,
    onDblClick: handleNodeDblClick,
    onClick: handleNodeClick,
    selected,
    renaming: state.renaming && selected,
  })
}

function handleNodeDblClick(node, e) {
  if (e.target.classList.contains("rename")) {
    return
  }
  const nextId = node.id
  const clickedNode = state.nodes.find((node) => node.id === nextId)
  if (clickedNode.type === TYPE.FOLDER) {
    state.currentFolder = clickedNode
    renderExplorerNodes()
  } else {
    console.log(`${clickedNode.name} is a file : OPEN`)
  }
}

function handleNodeClick(node, e) {
  if (e.target.classList.contains("rename")) {
    return
  }
  const previousSelection = [...state.selectedNodesIds]

  if (state.selectedNodesIds.find((id) => id === node.id)) {
    state.selectedNodesIds = []
  } else {
    state.selectedNodesIds = [node.id]
  }

  updateExplorerNodes([...previousSelection, ...state.selectedNodesIds])
}
