import { Node, rootFolder, state } from "~pages/explorer/state"
import { ID, NodeType } from "~pages/explorer/types"

let nextId = 13

export const dbTable: Node[] = [
  { id: 1, name: "Videos", type: NodeType.FOLDER, parentId: null },
  { id: 2, name: "Pictures", type: NodeType.FOLDER, parentId: null },
  { id: 3, name: "Documents", type: NodeType.FOLDER, parentId: null },
  { id: 4, name: "Music", type: NodeType.FOLDER, parentId: null },
  { id: 7, name: "New folder", type: NodeType.FOLDER, parentId: null },
  { id: 8, name: "New folder (2)", type: NodeType.FOLDER, parentId: null },
  { id: 5, name: "CV", type: NodeType.FOLDER, parentId: 3 },
  { id: 6, name: "Amine Tirecht.pdf", type: NodeType.FILE, parentId: 5 },
  { id: 9, name: "Hello world.txt", type: NodeType.FILE, parentId: null },
  { id: 10, name: "How is it going.mp3", type: NodeType.FILE, parentId: null },
  { id: 11, name: "desktop.ini", type: NodeType.FILE, parentId: null },
  { id: 12, name: "random.atirecht", type: NodeType.FILE, parentId: null },
]

export function findParents(lookupNode: Node): Node[] {
  if (lookupNode.parentId === null) {
    return [rootFolder]
  }

  const parent = dbTable.find((node) => node.id === lookupNode.parentId)

  if (parent == null) {
    return []
  }
  return [...findParents(parent), parent]
}

export function findNodeById(id: ID) {
  return dbTable.find((n) => n.id === id)
}

export function findNodeChildren(id: ID) {
  return dbTable.filter((n) => n.parentId === id)
}

export function getNodeAndChildren(id: ID) {
  if (id === rootFolder.id) {
    return {
      node: rootFolder,
      children: findNodeChildren(rootFolder.id),
    }
  }

  const node = findNodeById(id)
  if (node == null) {
    return null
  }
  return {
    node,
    children: findNodeChildren(id),
  }
}

export function storeNewNode(name: string, type: NodeType) {
  const suitableName = getSuitableName(name, type, state.currentFolder.id)
  const newlyCreatedNode = {
    id: nextId,
    name: suitableName,
    type,
    parentId: state.currentFolder.id,
  }
  dbTable.push(newlyCreatedNode)
  nextId++

  return newlyCreatedNode
}

export function deleteSelectedNodes() {
  deleteNodes(state.selectedNodeIds)
}

function deleteNodes(ids: number[]) {
  const buffer = [...ids]

  while (buffer.length > 0) {
    // store head
    const head = buffer[0]

    // find children of the current node
    const children = dbTable.reduce<number[]>(function (acc, node) {
      if (node.parentId === head && node.id != null) {
        acc.push(node.id)
      }
      return acc
    }, [])

    // push children at the end of the array
    buffer.push(...children)

    // removes head from buffer & from state
    buffer.shift()
    const stateNodeIndex = dbTable.findIndex((node) => node.id === head)
    dbTable.splice(stateNodeIndex, 1)
  }
}

function getSuitableName(newName: string, nodeType: NodeType, parentId: ID) {
  const regex = new RegExp(`^${newName}(?: \\(([0-9]*)\\))?$`)

  const suffix = dbTable.reduce<number | null>((max, node) => {
    const matches = node.name.match(regex)

    // if we find a matching name in the current folder & same type
    if (node.parentId === parentId && matches !== null && node.type === nodeType) {
      // if we still haven't found a max then use  "${newName} (2)"
      if (node.name === newName && max === null) {
        return 2
      }

      const nextNumber = Number(matches[1]) + 1

      // if no max but we have a match with a number, use nextNumber
      if (max === null) {
        return nextNumber
      } else {
        // if nextNumber bigger than max, use nextNumber
        if (nextNumber > max) {
          return nextNumber
        }
      }
    }

    return max
  }, null)

  return `${newName}${suffix ? ` (${suffix})` : ""}`
}
