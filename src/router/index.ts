import h from "hyperscript"
import cx from "classnames"

export type LinkProps = {
  path: string
  title: string
  className?: string
}
export function Link({ path, title, className }: LinkProps) {
  function handlClick(e: MouseEvent) {
    e.preventDefault()
    history.pushState(null, title, path)
  }

  return h("a", { className: cx("link", className), href: path, ["onclick"]: handlClick, title })
}
export function Router() {}
