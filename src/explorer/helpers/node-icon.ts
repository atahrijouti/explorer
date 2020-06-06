import { NodeType } from "~app/types"
import fileImage from "~images/file.png"
import folderImage from "~images/folder.png"
import unknownImage from "~images/unknown.png"

export const nodeIcon = (type: NodeType) => {
  switch (type) {
    case NodeType.FILE: return fileImage
    case NodeType.FOLDER: return folderImage
    default: return unknownImage
  }
}