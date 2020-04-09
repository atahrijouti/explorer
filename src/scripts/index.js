const explorer = document.querySelector("#explorer ul")
const goUp = document.getElementById("go-up")
const breadcrumb = document.getElementById("breadcrumb")

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
  currentId: 7,
  breadcrumb: [{ name: rootFolder.name, id: null }],
  nodes: [
    { id: 1, name: "Videos", type: TYPE.FOLDER, parentId: null },
    { id: 2, name: "Pictures", type: TYPE.FOLDER, parentId: null },
    { id: 3, name: "Documents", type: TYPE.FOLDER, parentId: null },
    { id: 4, name: "Music", type: TYPE.FOLDER, parentId: null },
    { id: 5, name: "CV", type: TYPE.FOLDER, parentId: 3 },
    { id: 6, name: "Amine Tirecht.pdf", type: TYPE.FILE, parentId: 5 },
  ],
  currentFolder: rootFolder,
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

  renderBreadcrumb()
}

function renderBreadcrumb() {
  const breadcrumbItems = findParents(state.currentFolder)
  if (state.currentFolder !== rootFolder) {
    breadcrumbItems.push(state.currentFolder)
  }

  breadcrumb.innerHTML = breadcrumbItems.reduce((accumulator, node) => {
    return (
      accumulator + `<li data-id="${node.id}"><span>${node.name}</span></li>`
    )
  }, "")

  Array.from(breadcrumb.querySelectorAll("li")).forEach((node) =>
    node.addEventListener("click", respondToBreadcrumbClick)
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

function respondToBreadcrumbClick(e) {
  const rawId = e.currentTarget.dataset.id
  if (rawId === "null") {
    goToRoot()
    return
  }

  const nextId = Number(e.currentTarget.dataset.id)
  state.currentFolder = state.nodes.find((node) => node.id === nextId)
  renderExplorer()
}

function navigateToParent() {
  if (state.currentFolder.parentId === null) {
    if (state.currentFolder.id !== null) {
      goToRoot()
    }
  } else {
    state.currentFolder = state.nodes.find(
      (node) => node.id === state.currentFolder.parentId
    )
    renderExplorer()
  }
}

function findParents(lookupNode) {
  if (lookupNode.parentId === null) {
    return [rootFolder]
  }
  const parent = state.nodes.find((node) => node.id === lookupNode.parentId)
  return [...findParents(parent), parent]
}

function goToRoot() {
  state.currentFolder = rootFolder
  renderExplorer()
}
