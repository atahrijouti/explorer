import { Node, SelectionChange, setCurrentFolder, setSelectedNodeIds, state } from "~app/state"
import { AppEvent, NodeType } from "~app/types"
import { NodeComponent } from "./components/node"

import "./explorer.scss"
import { appElement } from "~app"
import { dispatch } from "~app/helpers"

export const explorer = document.querySelector("#explorer") as HTMLElement

export function Explorer() {
  appElement.addEventListener(AppEvent.FOLDER_CHANGED, (e) => {
    renderExplorerNodes((e as CustomEvent<Node>).detail)
  })
  appElement.addEventListener(AppEvent.SELECTION_CHANGED, (e) => {
    const [current, previous] = (e as CustomEvent<SelectionChange>).detail
    renderSpecificExplorerNodes([...previous, ...current])
  })
  appElement.addEventListener(AppEvent.RENAME_NODE, () => {
    startRenaming()
  })
  // TODO: clean up when the explorer is unmounted
  document.addEventListener("keyup", handleKeyUp, false)
}

function handleKeyUp(e: KeyboardEvent) {
  if (e.key === "F2") {
    startRenaming()
  }
}

function handleInputKeyUp(node: Node, e: KeyboardEvent) {
  switch (e.key) {
    case "Enter":
      node.name = (e.currentTarget as HTMLInputElement).value
      state.isRenaming = false
      renderSpecificExplorerNodes(state.selectedNodeIds)
      break
    case "Escape":
      state.isRenaming = false
      renderSpecificExplorerNodes(state.selectedNodeIds)
      break
    default:
      return true
  }
}

function startRenaming() {
  state.isRenaming = true
  renderSpecificExplorerNodes(state.selectedNodeIds)
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
  state.isRenaming = false
}

function handleNodeClick(node: Node, e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains("rename") || node.id == null) {
    return
  }
  if (state.selectedNodeIds.find((id) => id === node.id)) {
    setSelectedNodeIds([])
  } else {
    setSelectedNodeIds([node.id])
    state.isRenaming = false
  }
}

/////// RENDER SECTION

export function buildNode(node: Node) {
  const isSelected = state.selectedNodeIds.find((n) => n === node.id) != null
  return NodeComponent({
    node,
    isSelected,
    isRenaming: state.isRenaming && isSelected,
    onClick: handleNodeClick,
    onDblClick: handleNodeDblClick,
    onKeyUp: handleInputKeyUp,
  })
}

export function renderExplorerNodes(currentFolder: Node) {
  const ul = document.createElement("ul")

  state.nodes.forEach((node) => {
    if (node.parentId === currentFolder.id) {
      ul.appendChild(buildNode(node))
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  explorer.querySelectorAll<HTMLLIElement>(selector).forEach((currentNodeDom) => {
    const id = Number(currentNodeDom.dataset.id)
    const node = state.nodes.find((n) => n.id === id)
    if (node == null) {
      return
    }
    const newNodeDom = buildNode(node)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    explorer.querySelector("ul")!.replaceChild(newNodeDom, currentNodeDom)
    // when newNodeDom has been mounted, trigger MOUNTED event on newNodeDom
    // so that newNodeDom also knows that it was mounted
    dispatch(newNodeDom, AppEvent.MOUNTED)
  })
}
