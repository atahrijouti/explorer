import { Node, rootFolder } from "~pages/explorer/state"
import { ID, NodeType } from "~pages/explorer/types"
import { getPathFromWindowUrl } from "~router"
import { API_URL } from "~config"
import { Http } from "~http"

export async function storeNewNode(name: string, type: NodeType, parent_id: ID) {
  return await Http.post(`${API_URL}/nodes`, {
    body: JSON.stringify({ name, type, parent_id })
  })
}

export async function renameNode(id: number, name: string) {
  return await Http.put(`${API_URL}/nodes/${id}`, {
    body: JSON.stringify({ name })
  })
}

export async function deleteNodes(ids: number[]) {
  return await Http.delete(`${API_URL}/nodes`, {
    body: JSON.stringify({ ids })
  })
}

export async function findNodeFromPath(): Promise<{ node: Node; breadcrumb: Node[] } | null> {
  const path = getPathFromWindowUrl()
  if (path === "/") {
    return {
      breadcrumb: [rootFolder],
      node: rootFolder
    }
  }

  return await Http.get(`${API_URL}/nodes-from-path${path}`)
}

export async function getNodeAndChildren(id: ID): Promise<{ node: Node; children: Node[] } | null> {
  if (id === rootFolder.id) {
    return await Http.get(`${API_URL}/root-nodes`)
  }

  return await Http.get(`${API_URL}/nodes/${id}`)
}
