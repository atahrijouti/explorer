import { AppEvent } from "~app/types"

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
