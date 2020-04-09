const explorer = document.querySelector("#explorer ul")

const root = {
  id: 0,
  type: "folder",
  name: "Home",
  children: [
    {
      id: 1,
      name: "Amine",
      type: "folder",
      children: [
        {
          id: 5,
          name: "Amine ATJ",
          type: "folder",
          children: [],
        },
        {
          id: 6,
          name: "Amine Maria",
          type: "folder",
          children: [],
        },
      ],
    },
    {
      id: 2,
      name: "ATJ",
      type: "folder",
      children: [],
    },
    {
      id: 3,
      name: "Maria",
      type: "folder",
      children: [],
    },
    {
      id: 4,
      name: "Yasmine",
      type: "folder",
      children: [
        {
          id: 7,
          name: "Yasmine ATJ",
          type: "folder",
          children: [],
        },
        {
          id: 8,
          name: "Yasmine Maria",
          type: "folder",
          children: [],
        },
      ],
    },
  ],
}

let currentFolder = root

main()

/////
function main() {
  renderExplorer()
}

function renderExplorer() {
  explorer.innerHTML = currentFolder.children.reduce((accumulator, file) => {
    return (
      accumulator +
      `<li data-id="${file.id}" class="node"><span>${file.name}</span></li>`
    )
  }, "")
  Array.from(explorer.querySelectorAll(".node")).forEach((node) =>
    node.addEventListener("dblclick", respondToNodeDblClick)
  )
}

function respondToNodeDblClick(e) {
  const nextId = Number(e.currentTarget.dataset.id)
  currentFolder = currentFolder.children.find((child) => child.id === nextId)
  renderExplorer()
}
