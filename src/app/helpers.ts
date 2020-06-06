export const dispatch = (element: HTMLElement, eventName: string, detail: any | null = null) => {
  if (detail == null) {
    element.dispatchEvent(new Event(eventName))
  } else {
    element.dispatchEvent(new CustomEvent(eventName, { detail }))
  }
}
