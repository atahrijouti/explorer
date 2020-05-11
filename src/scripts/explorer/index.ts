import { Node, setCurrentFolder, state } from "../app/state"
import { AppEvent, NodeType } from "../app/types"
import { deleteNodesBtn, renameBtn } from "../navigation-bar"
import { NodeComponent } from "./components/node"

import "./explorer.scss"
import { appElement } from "../app"
import { dispatch } from "../app/helpers"

// TODO : figure out how to get rid of `!`
export const explorer = document.querySelector("#explorer")!

export function Explorer() {
  appElement.addEventListener(AppEvent.FOLDER_CHANGED, (e) => {
    renderExplorerNodes((e as CustomEvent<Node>).detail)
  })
}

export function renderExplorerNodes(currentFolder: Node) {
  const ul = document.createElement("ul")

  state.nodes.forEach((node) => {
    if (node.parentId === currentFolder.id) {
      ul.appendChild(buildNode(node))
    }
  })

  explorer.replaceChild(ul, explorer.querySelector("ul")!)
}

/**
 * Re-Render nodes identified by a set of nodeIds
 * @param {number[]} nodeIds
 */
export function renderSpecificExplorerNodes(nodeIds: number[]) {
  if (nodeIds.length === 0) {
    return
  }
  // generate selector to select all existing dom nodes based on nodeIds
  const selector = nodeIds.map((id) => `[data-id="${id}"]`).join(",")

  explorer
    .querySelectorAll<HTMLLIElement>(selector)
    .forEach((currentNodeDom) => {
      const id = Number(currentNodeDom.dataset.id)
      const node = state.nodes.find((n) => n.id === id)
      if (node == null) {
        return
      }
      const newNodeDom = buildNode(node)
      explorer.querySelector("ul")!.replaceChild(newNodeDom, currentNodeDom)
      // when newNodeDom has been mounted, trigger MOUNTED event on newNodeDom
      // so that newNodeDom also knows that it was mounted
      dispatch(newNodeDom, AppEvent.MOUNTED)
    })
}

export function reRenderSelectedNodes() {
  renderSpecificExplorerNodes(state.selectedNodesIds)
}

function handleInputKeyUp(node: Node, e: KeyboardEvent) {
  switch (e.key) {
    case "Enter":
      node.name = (e.currentTarget as HTMLInputElement).value
      state.renaming = false
      reRenderSelectedNodes()
      break
    case "Escape":
      state.renaming = false
      reRenderSelectedNodes()
      break
    default:
      return true
  }
}

export function buildNode(node: Node) {
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

function handleNodeDblClick(node: Node, e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains("rename")) {
    return
  }
  const nextId = node.id
  const clickedNode = state.nodes.find((node) => node.id === nextId)
  if (clickedNode == null) {
    return
  }
  if (clickedNode.type === NodeType.FOLDER) {
    setCurrentFolder(clickedNode)
  } else {
    console.log(`${clickedNode.name} is a file : OPEN`)
  }
  deleteNodesBtn.removeAttribute("disabled")
  state.selectedNodesIds.length === 1 && renameBtn.removeAttribute("disabled")
  state.renaming = false
}

function handleNodeClick(node: Node, e: MouseEvent) {
  if (
    (e.target as HTMLElement).classList.contains("rename") ||
    node.id == null
  ) {
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
