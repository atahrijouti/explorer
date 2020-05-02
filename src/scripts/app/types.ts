export enum NodeType {
  FOLDER = "FOLDER",
  FILE = "FILE",
}

export enum CustomEvent {
  MOUNTED = "e-mounted",
}

export type Node = {
  id: number
  name: string
  type: NodeType
  parentId: number | null
}
