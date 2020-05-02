function InputLabel({ name, onKeyUp }) {
  const element = document.createElement("input")
  element.setAttribute("type", "text")
  element.classList.add("rename")
  element.value = name
  element.addEventListener("keyup", onKeyUp, false)
  return element
}

function TextLabel({ name }) {
  const element = document.createElement("span")
  element.classList.add("label")
  element.innerText = name
  return element
}

export function NodeComponent({
  node,
  onDblClick,
  onClick,
  selected,
  renaming,
  onKeyUp,
}) {
  const element = document.createElement("li")
  element.classList.add("node")
  element.dataset.id = node.id

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
