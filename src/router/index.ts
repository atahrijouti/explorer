import h from "hyperscript"
import cx from "classnames"
import { ROUTES } from "~router/routes"
import { AppEvent, dispatch } from "~pages/app/events"
import { rootElement } from "~index"

export type LinkProps = {
  path: string
  title: string
  className?: string
  children: Node | Node[]
}
export function Link({ path, title, children, className }: LinkProps) {
  function handlClick(e: MouseEvent) {
    e.preventDefault()
    navigateTo(path, title)
  }

  return h(
    "a",
    { className: cx("link", className), href: path, ["onclick"]: handlClick, title },
    children
  )
}

export function navigateTo(path: string, title: string) {
  const cleansedPath = cleanPath(path)
  pushState(cleansedPath, title)
  updateRoute(cleansedPath)
}

export function pushState(path: string, title: string) {
  history.pushState(null, title, path)
}

function cleanPath(path: string) {
  return path.replace(/\/$/, "")
}

function getPathFromWindowUrl() {
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
  } else {
    if (currentRouteComponent != null) {
      dispatch(currentRouteComponent, AppEvent.UNMOUNTED)
    }
    currentRouteHandler = urlMatch.component
    const routeElement = currentRouteHandler()
    rootElement.innerHTML = ""
    currentRouteComponent = routeElement
    rootElement.appendChild(routeElement)
    dispatch(routeElement, AppEvent.MOUNTED)
  }
}

function reflectRoute() {
  updateRoute(getPathFromWindowUrl())
}

export function Router() {
  reflectRoute()
}

// handle back and forward browser hisotry buttons, otherwise route is not reflect on content
window.onpopstate = function () {
  reflectRoute()
}
