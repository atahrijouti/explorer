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

function isRelativePath(path: string) {
  console.log(path)
  return path[0] !== "/"
}

export function navigateTo(path: string, title: string) {
  const cleansedPath = cleanPath(path)
  const isRelative = isRelativePath(cleansedPath)
  const redirectTo = isRelative ? `${getPathFromWindowUrl()}/${cleansedPath}` : cleansedPath
  console.log({ isRelative, redirectTo })
  pushState(redirectTo, title)
  updateRoute(redirectTo)
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

function getPathFromWindowUrl() {
  return cleanPath(window.location.pathname)
}

function matchPath(path: string) {
  return ROUTES.find((route) => path.match(route.pattern))
}

let currentRouteHandler: (() => HTMLElement) | null = null
let currentRoutePage: HTMLElement | null = null

function updateRoute(absolutePath: string) {
  if (isRelativePath(absolutePath)) {
    throw new Error(`The path must be in absolute form. Received \`${absolutePath}\` `)
  }

  const urlMatch = matchPath(absolutePath.substr(1))
  if (urlMatch == null) {
    return
  }

  if (urlMatch.page === currentRouteHandler && currentRoutePage != null) {
    dispatch(currentRoutePage, AppEvent.ROUTE_CHANGED)
  } else {
    // first unmount current page
    if (currentRoutePage != null) {
      dispatch(currentRoutePage, AppEvent.UNMOUNTED)
    }
    rootElement.innerHTML = ""

    // then hook new page
    currentRouteHandler = urlMatch.page
    const routeElement = currentRouteHandler()
    currentRoutePage = routeElement
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
