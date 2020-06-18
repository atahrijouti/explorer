import { Node } from "~app/state"
import { AppEvent } from "~app/types"
import { nodeIcon } from "~explorer/helpers/node-icon"

type InputLabelProps = {
  name: string
  onKeyUp: (e: KeyboardEvent) => void
}
function InputLabel({ name, onKeyUp }: InputLabelProps): HTMLInputElement {
  const element = document.createElement("input")
  element.setAttribute("type", "text")
  element.classList.add("rename")
  element.value = name
  element.addEventListener("keyup", onKeyUp, false)
  return element
}

type TextLabelProps = {
  name: string
}
function TextLabel({ name }: TextLabelProps): HTMLSpanElement {
  const element = document.createElement("span")
  element.classList.add("label")
  element.innerText = name
  return element
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
  const element = document.createElement("li") as HTMLLIElement
  element.addEventListener(
    "dblclick",
    (e) => {
      onDblClick(node, e)
    },
    false
  )
  element.addEventListener(
    "click",
    (e) => {
      onClick(node, e)
    },
    false
  )

  const img = document.createElement("img")
  img.setAttribute("alt", node.type)
  img.classList.add("icon")
  img.setAttribute("src", nodeIcon(node.type, node.name))

  const label = isRenaming
    ? InputLabel({
        name: node.name,
        onKeyUp: (e) => {
          onKeyUp(node, e)
        },
      })
    : TextLabel({ name: node.name })

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


  element.classList.add("node")
  element.dataset.id = `${node.id}`
  isSelected && element.classList.add("selected")
  element.appendChild(img)
  element.appendChild(label)
  return element
}
