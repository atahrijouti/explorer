import { appEmitter } from "~pages/explorer/index"

import { dispatch, AppEvent } from "./events"
import { getNodeAndChildren } from "~pages/explorer/queries"
import { ID, NodeType } from "~pages/explorer/types"

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
  breadcrumb: Array<Pick<Node, "id" | "name">>
  nodes: Node[]
  currentFolder: Node
  selectedNodeIds: number[]
  isRenaming: boolean
}
export const state: State = {
  breadcrumb: [{ name: rootFolder.name, id: null }],
  nodes: [],
  currentFolder: rootFolder,
  selectedNodeIds: [] as number[],
  isRenaming: false,
}

export const browserFolder = (node: Node) => {
  const result = getNodeAndChildren(node.id)
  if (result == null) {
    console.log("404 NOT FOUND (should probably redirect Home)")
    return
  }

  setUpUIForFolder(result)
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
