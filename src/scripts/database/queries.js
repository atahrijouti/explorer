import { rootFolder, state } from "../app/state"
import { renderExplorerNodes, explorer } from "../explorer"

export function findParents(lookupNode) {
  if (lookupNode.parentId === null) {
    return [rootFolder]
  }
  const parent = state.nodes.find((node) => node.id === lookupNode.parentId)
  return [...findParents(parent), parent]
}

export function createNewNode(name, type) {
  const suitableName = getSuitableName(name, type, state.currentFolder.id)

  state.nodes.push({
    id: state.nextId,
    name: suitableName,
    type,
    parentId: state.currentFolder.id,
  })
  state.nextId++
  renderExplorerNodes()
}

export function deleteNodes() {
  state.selectedNodesIds.forEach((id) => {
    const index = state.nodes.findIndex((node) => node.id === id)
    if (index === -1) {
      return
    }
    state.nodes.splice(index, 1)
  })
  state.selectedNodesIds = []
}

function getSuitableName(newName, nodeType, parentId) {
  const regex = new RegExp(`^${newName}(?: \\(([0-9]*)\\))?$`)

  const suffix = state.nodes.reduce((max, node) => {
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
