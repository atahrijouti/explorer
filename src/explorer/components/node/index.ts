import h from "hyperscript"

import { Node } from "~app/state"
import { AppEvent } from "~app/types"
import { nodeIcon } from "~explorer/helpers/node-icon"

type InputLabelProps = {
  name: string
  onKeyUp: (e: KeyboardEvent) => void
}
function InputLabel({ name, onKeyUp }: InputLabelProps) {
  return h<HTMLInputElement>("input.rename", { type: "text", value: name, onkeyup: onKeyUp })
}

type TextLabelProps = {
  name: string
}
function TextLabel({ name }: TextLabelProps) {
  return h<HTMLSpanElement>("span.label", name)
}

type Props = {
  node: Node
  isSelected: boolean
  isRenaming: boolean
  onKeyUp: (node: Node, e: KeyboardEvent) => void
  onDblClick: (node: Node, e: MouseEvent) => void
  onClick: (node: Node, e: MouseEvent) => void
}
export function NodeComponent({
  node,
  onDblClick,
  onClick,
  isSelected,
  isRenaming,
  onKeyUp,
}: Props) {
  const label = isRenaming
    ? InputLabel({
        name: node.name,
        onKeyUp: (e) => {
          onKeyUp(node, e)
        },
      })
    : TextLabel({ name: node.name })

  const element = h<HTMLLIElement>(
    "li",
    {
      className: `node ${isSelected ? "selected" : ""}`,
      ["ondblclick"]: (e: MouseEvent) => onDblClick(node, e),
      ["onclick"]: (e: MouseEvent) => onClick(node, e),
      "data-id": node.id,
    },
    h(
      "div",
      h("img.icon", { alt: node.type, src: nodeIcon(node.type), className: "icon-container" })
    ),
    label
  )

  if (isRenaming) {
    // inside of this listener we are sure the element is mounted in the browser
    // dom
    element.addEventListener(
      AppEvent.MOUNTED,
      () => {
        label.focus()
      },
      false
    )
  }

  return element
}
