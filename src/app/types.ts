export enum NodeType {
  FOLDER = "FOLDER",
  FILE = "FILE",
}

export enum AppEvent {
  MOUNTED = "e-mounted",
  SELECTION_CHANGED = "e-selection-changed",
  FOLDER_CHANGED = "e-folder-changed",
  RENAME_NODE = "e-rename-node",
  REMOVE_NODES = "e-remove-nodes",
  CREATE_NODE = "e-create-node",
}
