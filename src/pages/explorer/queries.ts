import { ID, Node, NodeType, rootFolder, state } from "~pages/explorer/state"

export function findParents(lookupNode: Node): Node[] {
  if (lookupNode.parentId === null) {
    return [rootFolder]
  }

  const parent = state.nodes.find((node) => node.id === lookupNode.parentId)

  if (parent == null) {
    return []
  }
  return [...findParents(parent), parent]
}

export function storeNewNode(name: string, type: NodeType) {
  const suitableName = getSuitableName(name, type, state.currentFolder.id)
  const newlyCreatedNode = {
    id: state.nextId,
    name: suitableName,
    type,
    parentId: state.currentFolder.id,
  }
  state.nodes.push(newlyCreatedNode)
  state.nextId++

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
    const children = state.nodes.reduce<number[]>(function (acc, node) {
      if (node.parentId === head && node.id != null) {
        acc.push(node.id)
      }
      return acc
    }, [])

    // push children at the end of the array
    buffer.push(...children)

    // removes head from buffer & from state
    buffer.shift()
    const stateNodeIndex = state.nodes.findIndex((node) => node.id === head)
    state.nodes.splice(stateNodeIndex, 1)
  }
}

function getSuitableName(newName: string, nodeType: NodeType, parentId: ID) {
  const regex = new RegExp(`^${newName}(?: \\(([0-9]*)\\))?$`)

  const suffix = state.nodes.reduce<number | null>((max, node) => {
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
