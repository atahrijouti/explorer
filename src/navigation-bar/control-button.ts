import h from "hyperscript"

type ControlButtonProps = {
  label: string
  image: string
}
export const ControlButton = ({ label, image }: ControlButtonProps) => {
  return h(
    "button",
    { className: "control-button" },
    h("img", { src: image }),
    h("span", { className: "label" }, label)
  )
}