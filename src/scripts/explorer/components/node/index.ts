import { Node, CustomEvent } from "../../../app/types"

type InputLabelProps = {
  name: string
  onKeyUp: (e: KeyboardEvent) => void
}
function InputLabel({ name, onKeyUp }: InputLabelProps) {
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
function TextLabel({ name }: TextLabelProps) {
  const element = document.createElement("span")
  element.classList.add("label")
  element.innerText = name
  return element
}

type NodeComponent = {
  node: Node
  selected: boolean
  renaming: boolean
  onDblClick: (node: Node, e: MouseEvent) => void
  onClick: (node: Node, e: MouseEvent) => void
  onKeyUp: (node: Node, e: KeyboardEvent) => void
}
export function NodeComponent({
  node,
  onDblClick,
  onClick,
  selected,
  renaming,
  onKeyUp,
}: NodeComponent) {
  // we are adding a non native property in a hacky way to our LI down the line
  const element = document.createElement("li") as HTMLLIElement & {
    listensToMount: boolean
  }
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
    element.listensToMount = true
    // inside of this listener we are sure the element is mounted in the browser
    // dom
    element.addEventListener(
      CustomEvent.MOUNTED,
      () => {
        label.focus()
      },
      false
    )
  }
  element.appendChild(label)
  return element
}
