const explorer = document.querySelector("#explorer")
const goUp = document.getElementById("go-up")
const breadcrumb = document.getElementById("breadcrumb")
const newFolderBtn = document.getElementById("new-folder")
const newFileBtn = document.getElementById("new-file")

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
  nextId: 9,
  breadcrumb: [{ name: rootFolder.name, id: null }],
  nodes: [
    { id: 1, name: "Videos", type: TYPE.FOLDER, parentId: null },
    { id: 2, name: "Pictures", type: TYPE.FOLDER, parentId: null },
    { id: 3, name: "Documents", type: TYPE.FOLDER, parentId: null },
    { id: 4, name: "Music", type: TYPE.FOLDER, parentId: null },
    { id: 7, name: "New folder", type: TYPE.FOLDER, parentId: null },
    { id: 8, name: "New folder (2)", type: TYPE.FOLDER, parentId: null },
    { id: 5, name: "CV", type: TYPE.FOLDER, parentId: 3 },
    { id: 6, name: "Amine Tirecht.pdf", type: TYPE.FILE, parentId: 5 },
  ],
  currentFolder: rootFolder,
}

main()

/////
function main() {
  goUp.addEventListener("click", navigateToParent, false)
  newFolderBtn.addEventListener(
    "click",
    () => createNewNode("New folder", TYPE.FOLDER),
    false
  )
  newFileBtn.addEventListener(
    "click",
    () => createNewNode("New file", TYPE.FILE),
    false
  )
  renderExplorer()
}

function NodeComponent(node) {
  const element = document.createElement("li")
  element.classList.add("node")
  element.addEventListener(
    "dblclick",
    () => {
      respondToNodeDblClick(node)
    },
    false
  )
  element.innerHTML = `<span>${node.name}</span>`
  return element
}

function renderExplorer() {
  const ul = document.createElement("ul")

  state.nodes.forEach((node) => {
    if (node.parentId === state.currentFolder.id) {
      ul.appendChild(NodeComponent(node))
    }
  })

  explorer.replaceChild(ul, explorer.querySelector("ul"))

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

function respondToNodeDblClick(node) {
  const nextId = node.id
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

function createNewNode(name, type) {
  const suitableName = getSuitableName(name, type, state.currentFolder.id)

  state.nodes.push({
    id: state.nextId,
    name: suitableName,
    type,
    parentId: state.currentFolder.id,
  })
  state.nextId++
  renderExplorer()
}

function getSuitableName(newName, nodeType, parentId) {
  const regex = new RegExp(`^${newName}(?: \\(([0-9]*)\\))?$`)

  const suffix = state.nodes.reduce((max, node) => {
    const matches = node.name.match(regex)

    // if we find a matching name in the current folder & same type
    if (
      node.parentId === parentId &&
      matches !== null &&
      node.type == nodeType
    ) {
      // if we still haven't found a max then use  "${newName} (2)"
      if (node.name === newName && max === null) {
        return 2
      }

      const nextNumber = Number(matches[1]) + 1

      // if no max but we have a match with a number, use nextNumber
      if (max === null) {
        return nextNumber
      } else {
        // if nextNumber bigger than max, use nextNumber
        if (nextNumber > max) {
          return nextNumber
        }
      }
    }

    return max
  }, null)

  return `${newName}${suffix ? ` (${suffix})` : ""}`
}
