import { ROUTES } from "~router/routes"
import { AppEvent, dispatch } from "~pages/explorer/events"
import { rootElement } from "~index"

function isRelativePath(path: string) {
  return !path.startsWith("/")
}

export function navigateTo(path: string, title: string) {
  const cleansedPath = cleanPath(path)
  const isRelative = isRelativePath(cleansedPath)
  const prefix = getPathFromWindowUrl() === "/" ? "" : getPathFromWindowUrl()
  const absolutePath = isRelative ? `${prefix}/${cleansedPath}` : cleansedPath
  pushState(absolutePath, title)
  updateRoute(absolutePath)
}

export function pushState(path: string, title: string) {
  history.pushState(null, title, path)
}

function cleanPath(path: string) {
  if (path === "/") {
    return path
  }
  return path.replace(/\/$/, "")
}

export function getPathFromWindowUrl() {
  return cleanPath(window.location.pathname)
}

function matchPath(path: string) {
  return ROUTES.find((route) => path.match(route.pattern))
}

let currentRouteFunction: (() => HTMLElement) | null = null
let currentRoutePageDomElement: HTMLElement | null = null

function updateRoute(absolutePath: string) {
  if (isRelativePath(absolutePath)) {
    throw new Error(`The path must be in absolute form. Received \`${absolutePath}\``)
  }

  const urlMatch = matchPath(absolutePath.substr(1))
  if (urlMatch == null) {
    return
  }

  if (urlMatch.page === currentRouteFunction && currentRoutePageDomElement != null) {
    dispatch(currentRoutePageDomElement, AppEvent.ROUTE_CHANGED)
  } else {
    // first unmount current page
    if (currentRoutePageDomElement != null) {
      dispatch(currentRoutePageDomElement, AppEvent.UNMOUNTED)
    }
    rootElement.innerHTML = ""

    // then hook new page
    currentRouteFunction = urlMatch.page
    const routeElement = currentRouteFunction()
    currentRoutePageDomElement = routeElement
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

// handle back and forward browser history buttons, otherwise route is not reflect on content
window.onpopstate = function () {
  reflectRoute()
}
