import { ID, Node, rootFolder, state } from "../app/state"
import { buildNode, explorer, renderSpecificExplorerNodes } from "../explorer"
import { AppEvent, NodeType } from "../app/types"
import { dispatch } from "../app/helpers"

export function findParents(lookupNode: Node): Node[] {
  if (lookupNode.parentId === null) {
    return [rootFolder]
  }
  const parent = state.nodes.find((node) => node.id === lookupNode.parentId)!
  return [...findParents(parent), parent]
}

export function createNewNode(name: string, type: NodeType) {
  /// unselect selected
  const previousSelection = [...state.selectedNodesIds]
  state.selectedNodesIds = []
  renderSpecificExplorerNodes(previousSelection)

  const suitableName = getSuitableName(name, type, state.currentFolder.id)
  const newlyCreatedNode = {
    id: state.nextId,
    name: suitableName,
    type,
    parentId: state.currentFolder.id,
  }
  state.nodes.push(newlyCreatedNode)
  state.renaming = true
  state.selectedNodesIds = [newlyCreatedNode.id]
  const node = buildNode(newlyCreatedNode)
  explorer.querySelector("ul")!.appendChild(node)
  // when newNodeDom has been mounted, trigger MOUNTED event on newNodeDom
  // so that newNodeDom also knows that it was mounted
  dispatch(node, AppEvent.MOUNTED)
  state.nextId++
}

export function deleteSelectedNodes() {
  deleteNode(state.selectedNodesIds)
  state.selectedNodesIds = []
}

function deleteNode(ids: number[]) {
  const buffer = [...ids]

  while (buffer.length > 0) {
    // store head
    const head = buffer[0]

    // find children of the current node
    const children = state.nodes.reduce<number[]>(function (acc, node) {
      if (node.parentId === head) {
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
    if (
      node.parentId === parentId &&
      matches !== null &&
      node.type === nodeType
    ) {
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
