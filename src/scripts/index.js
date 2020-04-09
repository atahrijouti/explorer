const explorer = document.querySelector("#explorer ul")

const TYPE = Object.freeze({
  FOLDER: "FOLDER",
  FILE: "FILE",
})

const nodes = [
  { id: 1, name: "Videos", type: TYPE.FOLDER, parentId: null },
  { id: 2, name: "Pictures", type: TYPE.FOLDER, parentId: null },
  { id: 3, name: "Documents", type: TYPE.FOLDER, parentId: null },
  { id: 4, name: "Music", type: TYPE.FOLDER, parentId: null },
  { id: 5, name: "CV", type: TYPE.FOLDER, parentId: 3 },
  { id: 6, name: "Amine Tirecht.pdf", type: TYPE.FILE, parentId: 5 },
]

let currentFolder = {
  id: null,
  name: "Home",
  type: TYPE.FOLDER,
  parentId: null,
}

main()

/////
function main() {
  renderExplorer()
}

function renderExplorer() {
  explorer.innerHTML = nodes.reduce((accumulator, node) => {
    if (node.parentId === currentFolder.id) {
      return (
        accumulator +
        `<li data-id="${node.id}" class="node"><span>${node.name}</span></li>`
      )
    }
    return accumulator + ""
  }, "")
  Array.from(explorer.querySelectorAll(".node")).forEach((node) =>
    node.addEventListener("dblclick", respondToNodeDblClick)
  )
}

function respondToNodeDblClick(e) {
  const nextId = Number(e.currentTarget.dataset.id)
  currentFolder = nodes.find((node) => node.id === nextId)
  renderExplorer()
}
