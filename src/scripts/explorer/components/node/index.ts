import { Node } from "../../../app/state"
import { AppEvent } from "../../../app/types"

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
  selected: boolean
  renaming: boolean
  onKeyUp: (node: Node, e: KeyboardEvent) => void
  onDblClick: (node: Node, e: MouseEvent) => void
  onClick: (node: Node, e: MouseEvent) => void
}
export function NodeComponent({
  node,
  onDblClick,
  onClick,
  selected,
  renaming,
  onKeyUp,
}: Props) {
  const element = document.createElement("li") as HTMLLIElement
  element.classList.add("node")
  element.dataset.id = `${node.id}`

  selected && element.classList.add("selected")

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

  const label = renaming
    ? InputLabel({
        name: node.name,
        onKeyUp: (e) => {
          onKeyUp(node, e)
        },
      })
    : TextLabel({ name: node.name })

  if (renaming) {
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
  element.appendChild(label)
  return element
}
