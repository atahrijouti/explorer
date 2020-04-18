export function NodeComponent({
  node,
  onDblClick,
  onClick,
  selected,
  renaming,
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
    ? `<input type="text" class="rename" value="${node.name}" />`
    : `<span class="label">${node.name}</span>`

  element.innerHTML = label
  return element
}
