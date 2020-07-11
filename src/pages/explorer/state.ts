import { appEmitter } from "~pages/explorer/index"

import { dispatch, AppEvent } from "./events"
import { getNodeAndChildren } from "~pages/explorer/queries"
import { ID, NodeType } from "~pages/explorer/types"
import { navigateTo } from "~router"

export type Node = {
  id: ID
  name: string
  type: NodeType
  parentId: ID
}
export const rootFolder: Node = Object.freeze({
  id: null,
  name: "Home",
  type: NodeType.FOLDER,
  parentId: null,
})

type State = {
  breadcrumb: Node[]
  nodes: Node[]
  currentFolder: Node
  selectedNodeIds: number[]
  isRenaming: boolean
}
export const state: State = {
  breadcrumb: [{ ...rootFolder }],
  nodes: [],
  currentFolder: rootFolder,
  selectedNodeIds: [] as number[],
  isRenaming: false,
}

export const browseFolder = (node: Node) => {
  const result = getNodeAndChildren(node.id)
  if (result == null) {
    console.log("404 NOT FOUND (should probably redirect Home)")
    return
  }

  setUpBreadcrumb(result.node)
  setUpUIForFolder(result)
  navigateToFolder()
}

const setUpBreadcrumb = (node: Node) => {
  if (node.id === rootFolder.id) {
    state.breadcrumb = [rootFolder]
    return
  }
  const clone = [...state.breadcrumb]
  const parentIndex = clone.findIndex((breadcrumbNode) => breadcrumbNode.id === node.parentId)
  if (parentIndex < 0) {
    throw Error("This is probably an edge case, but I will still raise the error :P")
  }
  clone.splice(parentIndex + 1)
  state.breadcrumb = [...clone, node]
}

const navigateToFolder = () => {
  const [_, ...pathParts] = state.breadcrumb
  const absolutePath = `/${pathParts.map((node) => node.name).join("/")}`
  navigateTo(absolutePath, state.currentFolder.name)
}

const setUpUIForFolder = ({ node, children }: { node: Node; children: Node[] }) => {
  state.currentFolder = node
  state.nodes = [...children]
  dispatch(appEmitter, AppEvent.FOLDER_CHANGED, node)
  setSelectedNodeIds([])
  // todo: update breadcrumb, and from it, the path as well
}

export type SelectionChange = Array<number[]>
export const setSelectedNodeIds = (ids: number[]) => {
  const previous = [...state.selectedNodeIds]
  state.selectedNodeIds = ids
  dispatch(appEmitter, AppEvent.SELECTION_CHANGED, <SelectionChange>[
    state.selectedNodeIds,
    previous,
  ])
}
