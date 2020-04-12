export function NodeComponent(node, onDblClick) {
  const element = document.createElement("li")
  element.classList.add("node")
  element.addEventListener(
    "dblclick",
    () => {
      onDblClick(node)
    },
    false
  )
  element.innerHTML = `<span>${node.name}</span>`
  return element
}
