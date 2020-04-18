import { TYPE } from "./types"

export const rootFolder = Object.freeze({
  id: null,
  name: "Home",
  type: TYPE.FOLDER,
  parentId: null,
})

export const state = {
  nextId: 9,
  breadcrumb: [{ name: rootFolder.name, id: null }],
  nodes: [
    { id: 1, name: "Videos", type: TYPE.FOLDER, parentId: null },
    { id: 2, name: "Pictures", type: TYPE.FOLDER, parentId: null },
    { id: 3, name: "Documents", type: TYPE.FOLDER, parentId: null },
    { id: 4, name: "Music", type: TYPE.FOLDER, parentId: null },
    { id: 7, name: "New folder", type: TYPE.FOLDER, parentId: null },
    { id: 8, name: "New folder (2)", type: TYPE.FOLDER, parentId: null },
    { id: 5, name: "CV", type: TYPE.FOLDER, parentId: 3 },
    { id: 6, name: "Amine Tirecht.pdf", type: TYPE.FILE, parentId: 5 },
  ],
  currentFolder: rootFolder,
  selectedNodesIds: [],
}
