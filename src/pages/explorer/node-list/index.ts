import h from "hyperscript"

import {
  browseFolder,
  Node,
  SelectionChange,
  setSelectedNodeIds,
  state,
} from "~pages/explorer/state"
import { AppEvent, dispatch } from "~pages/explorer/events"
import { storeNewNode, deleteNodes } from "~pages/explorer/queries"

import { NodeComponent } from "./node"
import "./node-list.scss"
import { appEmitter } from "~pages/explorer"
import { NodeType } from "~pages/explorer/types"

export function NodeList() {
  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === "F2") {
      startRenaming()
    }
  }

  async function createNewNode(e: Event) {
    const type = (e as CustomEvent<NodeType>).detail
    const name = type === NodeType.FILE ? "New File" : "New Folder"
    const node = (await storeNewNode(name, type, state.currentFolder.id)) as Node & { id: number }
    state.nodes.push(node)
    state.isRenaming = true
    const domNode = buildNode(node)
    ul.appendChild(domNode)
    setSelectedNodeIds([node.id])
    dispatch(domNode, AppEvent.MOUNTED)
  }

  function removeNodes() {
    state.selectedNodeIds.forEach((id) => {
      explorer.querySelector(`[data-id="${id}"]`)?.remove()
    })
    deleteSelectedNodes()
    setSelectedNodeIds([])
  }

  function deleteSelectedNodes() {
    deleteNodes(state.selectedNodeIds)
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

  async function handleNodeDblClick(node: Node, e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains("rename")) {
      return
    }
    if (node.type === NodeType.FOLDER) {
      await browseFolder(node)
    } else {
      console.log(`${node.name} is a file : OPEN`)
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

  function buildNode(node: Node) {
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

  function renderExplorerNodes() {
    const newUl = buildUl()

    state.nodes.forEach((node) => {
      newUl.appendChild(buildNode(node))
    })

    explorer.replaceChild(newUl, ul)
    ul = newUl
  }

  function buildUl() {
    return h("ul", { className: "grid" })
  }

  function renderSpecificExplorerNodes(nodeIds: number[]) {
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
      ul.replaceChild(newNodeDom, currentNodeDom)
      // when newNodeDom has been mounted, trigger MOUNTED event on newNodeDom
      // so that newNodeDom also knows that it was mounted
      dispatch(newNodeDom, AppEvent.MOUNTED)
    })
  }

  appEmitter.addEventListener(AppEvent.FOLDER_CHANGED, () => {
    renderExplorerNodes()
  })
  appEmitter.addEventListener(AppEvent.SELECTION_CHANGED, (e) => {
    const [current, previous] = (e as CustomEvent<SelectionChange>).detail
    renderSpecificExplorerNodes([...previous, ...current])
  })
  appEmitter.addEventListener(AppEvent.RENAME_NODE, startRenaming)
  appEmitter.addEventListener(AppEvent.REMOVE_NODES, removeNodes)
  appEmitter.addEventListener(AppEvent.CREATE_NODE, createNewNode)

  // TODO: clean up when the explorer is unmounted
  document.addEventListener("keyup", handleKeyUp, false)

  let ul = buildUl()
  const explorer = h("main", { className: "node-list" }, ul)

  return explorer
}
