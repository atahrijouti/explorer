const explorer = document.querySelector("#explorer ul")
const goUp = document.getElementById("go-up")

const TYPE = Object.freeze({
  FOLDER: "FOLDER",
  FILE: "FILE",
})

const rootFolder = Object.freeze({
  id: null,
  name: "Home",
  type: TYPE.FOLDER,
  parentId: null,
})

const state = {
  nodes: [
    { id: 1, name: "Videos", type: TYPE.FOLDER, parentId: null },
    { id: 2, name: "Pictures", type: TYPE.FOLDER, parentId: null },
    { id: 3, name: "Documents", type: TYPE.FOLDER, parentId: null },
    { id: 4, name: "Music", type: TYPE.FOLDER, parentId: null },
    { id: 5, name: "CV", type: TYPE.FOLDER, parentId: 3 },
    { id: 6, name: "Amine Tirecht.pdf", type: TYPE.FILE, parentId: 5 },
  ],
  currentFolder: {
    id: null,
    name: "Home",
    type: TYPE.FOLDER,
    parentId: null,
  },
}

main()

/////
function main() {
  goUp.addEventListener("click", navigateToParent, false)
  renderExplorer()
}

function renderExplorer() {
  explorer.innerHTML = state.nodes.reduce((accumulator, node) => {
    if (node.parentId === state.currentFolder.id) {
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
  const clickedNode = state.nodes.find((node) => node.id === nextId)
  if (clickedNode.type === TYPE.FOLDER) {
    state.currentFolder = clickedNode
    renderExplorer()
  } else {
    console.log(`${clickedNode.name} is a file : OPEN`)
  }
}

function navigateToParent() {
  if (state.currentFolder.parentId === null) {
    if (state.currentFolder.id !== null) {
      state.currentFolder = rootFolder
      renderExplorer()
    }
  } else {
    state.currentFolder = state.nodes.find(
      (node) => node.id === state.currentFolder.parentId
    )
    renderExplorer()
  }
}
