import h from "hyperscript"

import { Node } from "~app/state"
import { AppEvent } from "~app/types"
import { nodeIcon } from "~explorer/helpers/node-icon"

type InputLabelProps = {
  name: string
  onKeyUp: (e: KeyboardEvent) => void
}
function InputLabel({ name, onKeyUp }: InputLabelProps) {
  return h("input", {
    type: "text",
    className: "rename",
    value: name,
    onkeyup: onKeyUp,
  })
}

type TextLabelProps = {
  name: string
}
function TextLabel({ name }: TextLabelProps) {
  return h("span", { className: "label" }, name)
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

  return h(
    "li",
    {
      className: `node ${isSelected ? "selected" : ""}`,
      ["ondblclick"]: (e: MouseEvent) => onDblClick(node, e),
      ["onclick"]: (e: MouseEvent) => onClick(node, e),
      ...(isRenaming && {
        // HyperScript is really bad, since it requires an on prefix for event listeners
        [`on${AppEvent.MOUNTED}`]: () => {
          label.focus()
        },
      }),
      "data-id": node.id,
    },
    h("img", { className: "icon", alt: node.type, src: nodeIcon(node) }),
    label
  )
}
