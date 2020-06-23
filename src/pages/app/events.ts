export enum AppEvent {
  MOUNTED = "e-mounted",
  SELECTION_CHANGED = "e-selection-changed",
  FOLDER_CHANGED = "e-folder-changed",
  RENAME_NODE = "e-rename-node",
  REMOVE_NODES = "e-remove-nodes",
  CREATE_NODE = "e-create-node",
}

export const dispatch = (
  element: HTMLElement | EventTarget,
  eventName: AppEvent,
  detail: unknown | null = null
) => {
  if (detail == null) {
    element.dispatchEvent(new Event(eventName))
  } else {
    element.dispatchEvent(new CustomEvent(eventName, { detail }))
  }
}
