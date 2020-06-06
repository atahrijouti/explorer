import { AppEvent, NodeType } from "./types"
import { dispatch } from "./helpers"
import { appElement } from "./index"

export type ID = number | null
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
  nextId: number
  breadcrumb: Array<Pick<Node, "id" | "name">>
  nodes: Node[]
  currentFolder: Node
  selectedNodeIds: number[]
  isRenaming: boolean
}
export const state: State = {
  nextId: 9,
  breadcrumb: [{ name: rootFolder.name, id: null }],
  nodes: [
    { id: 1, name: "Videos", type: NodeType.FOLDER, parentId: null },
    { id: 2, name: "Pictures", type: NodeType.FOLDER, parentId: null },
    { id: 3, name: "Documents", type: NodeType.FOLDER, parentId: null },
    { id: 4, name: "Music", type: NodeType.FOLDER, parentId: null },
    { id: 7, name: "New folder", type: NodeType.FOLDER, parentId: null },
    { id: 8, name: "New folder (2)", type: NodeType.FOLDER, parentId: null },
    { id: 5, name: "CV", type: NodeType.FOLDER, parentId: 3 },
    { id: 6, name: "Amine Tirecht.pdf", type: NodeType.FILE, parentId: 5 },
  ],
  currentFolder: rootFolder,
  selectedNodeIds: [] as number[],
  isRenaming: false,
}

export const setCurrentFolder = (folder: Node) => {
  state.currentFolder = folder
  dispatch(appElement, AppEvent.FOLDER_CHANGED, folder)
  setSelectedNodeIds([])
}

export type SelectionChange = Array<number[]>
export const setSelectedNodeIds = (ids: number[]) => {
  const previous = [...state.selectedNodeIds]
  state.selectedNodeIds = ids
  dispatch(appElement, AppEvent.SELECTION_CHANGED, <SelectionChange>[
    state.selectedNodeIds,
    previous,
  ])
}
