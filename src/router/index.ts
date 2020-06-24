import h from "hyperscript"
import cx from "classnames"
import { ROUTES } from "~router/routes"
import { AppEvent, dispatch } from "~pages/app/events"
import { rootElement } from "~index"

export type LinkProps = {
  path: string
  title: string
  className?: string
}
export function Link({ path, title, className }: LinkProps) {
  function handlClick(e: MouseEvent) {
    e.preventDefault()
    navigate(path, title)
  }

  return h(
    "a",
    { className: cx("link", className), href: path, ["onclick"]: handlClick, title },
    title
  )
}

export function navigate(path: string, title: string) {
  pushState(path, title)
  updateRoute(cleanPath(path))
}

export function pushState(path: string, title: string) {
  history.pushState(null, title, path)
}

function cleanPath(path: string) {
  return path.replace(/\/$/, "").replace(/^\//, "")
}

function getPath() {
  return cleanPath(window.location.pathname)
}

function matchPath(path: string) {
  return ROUTES.find((route) => path.match(route.pattern))
}

let currentRouteHandler: (() => HTMLElement) | null = null
let currentRouteComponent: HTMLElement | null = null

function updateRoute(path: string) {
  const urlMatch = matchPath(path)
  if (urlMatch == null) {
    return
  }

  if (urlMatch.component === currentRouteHandler && currentRouteComponent != null) {
    dispatch(currentRouteComponent, AppEvent.ROUTE_CHANGED)
    console.log("ROUTECHANGED")
  } else {
    currentRouteHandler = urlMatch.component
    const routeElement = currentRouteHandler()
    rootElement.innerHTML = ""
    currentRouteComponent = routeElement
    rootElement.appendChild(routeElement)
    dispatch(routeElement, AppEvent.MOUNTED)
    console.log("MOUNTED NEW")
  }
}

export function Router() {
  updateRoute(getPath())
}
