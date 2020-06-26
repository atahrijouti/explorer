import h from "hyperscript"
import cx from "classnames"

type ControlButtonProps = {
  label: Node | string
  image: string
  className?: string
}

export const ControlButton = ({
  label,
  image,
  className,
  type = "button",
  ...props
}: ControlButtonProps) => {
  return h(
    "button",
    { className: cx("control-button", className), props },
    h("img", { src: image }),
    h("span", { className: "label" }, label)
  )
}
