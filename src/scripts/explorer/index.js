import { explorer } from "../app"
import { state } from "../app/state"
import { TYPE } from "../app/types"
import { renderBreadcrumb } from "../navigation-bar"
import { NodeComponent } from "./components/node"

export function renderExplorer() {
  const ul = document.createElement("ul")

  state.nodes.forEach((node) => {
    if (node.parentId === state.currentFolder.id) {
      ul.appendChild(NodeComponent(node, handleNodeDblClick))
    }
  })

  explorer.replaceChild(ul, explorer.querySelector("ul"))

  renderBreadcrumb()
}

export function handleNodeDblClick(node) {
  const nextId = node.id
  const clickedNode = state.nodes.find((node) => node.id === nextId)
  if (clickedNode.type === TYPE.FOLDER) {
    state.currentFolder = clickedNode
    renderExplorer()
  } else {
    console.log(`${clickedNode.name} is a file : OPEN`)
  }
}
