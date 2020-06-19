import { NodeType } from "~app/types"
import fileImage from "~images/file.png"
import folderImage from "~images/folder.png"
import fullFolderImage from "~images/full_folder.png"
import textFileImage from "~images/text_file.png"
import audioFileImage from "~images/audio_file.png"
import unknownImage from "~images/unknown.png"
import { Node } from "~app/state"

export function nodeIcon(node: Node): string {
  switch (node.type) {
    case NodeType.FILE: return getFileImage(node)
    case NodeType.FOLDER: return getFolderImage(node)
    default: return unknownImage
  }
}

function getFolderImage(node: Node) {
  return folderImage
}

function getFileImage(node: Node) {
  return fileImage
}