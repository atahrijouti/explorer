import h from "hyperscript"

import {
  NodeType,
  Node,
  SelectionChange,
  setCurrentFolder,
  setSelectedNodeIds,
  state,
} from "~pages/explorer/state"
import { AppEvent, dispatch } from "~pages/explorer/events"
import { deleteSelectedNodes, storeNewNode } from "~pages/explorer/queries"

import { NodeComponent } from "./node"
import "./node-list.scss"
import { appEmitter } from "~pages/explorer"

export function NodeList() {
  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === "F2") {
      startRenaming()
    }
  }

  function createNewNode(e: Event) {
    const type = (e as CustomEvent<NodeType>).detail
    const name = type === NodeType.FILE ? "New File" : "New Folder"
    const node = storeNewNode(name, type)
    state.isRenaming = true
    setSelectedNodeIds([node.id])
    const domNode = buildNode(node)
    ul.appendChild(domNode)
    dispatch(domNode, AppEvent.MOUNTED)
  }

  function removeNodes() {
    state.selectedNodeIds.forEach((id) => {
      explorer.querySelector(`[data-id="${id}"]`)?.remove()
    })
    deleteSelectedNodes()
    setSelectedNodeIds([])
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

  function renderExplorerNodes(currentFolder: Node) {
    const newUl = buildUl()

    state.nodes.forEach((node) => {
      if (node.parentId === currentFolder.id) {
        newUl.appendChild(buildNode(node))
      }
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

  appEmitter.addEventListener(AppEvent.FOLDER_CHANGED, (e) => {
    renderExplorerNodes((e as CustomEvent<Node>).detail)
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
