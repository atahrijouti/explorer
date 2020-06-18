import { NodeType } from "~app/types"
import fileImage from "~images/file.png"
import textFileImage from "~images/text_file.png"
import audioFileImage from "~images/audio_file.png"
import folderImage from "~images/folder.png"
import fullFolderImage from "~images/full_folder.png"
import unknownImage from "~images/unknown.png"

export const nodeIcon = (type: NodeType, name: string) => {
  if (type === NodeType.FOLDER || type === NodeType.FULL_FOLDER) {
    return getFolderIcon(type)
  } else {
    // TODO : double check this
    const extension = name.split('.').pop();
    switch (extension) {
      // TODO : add more extensions
      case 'txt' : return textFileImage
      case 'mp3' : return audioFileImage
      default: return unknownImage
    }
  }
}

export const getFolderIcon = (type: NodeType) => {
  switch (type) {
    case NodeType.FOLDER: return folderImage
    case NodeType.FULL_FOLDER: return fullFolderImage
    default: return unknownImage
  }
}