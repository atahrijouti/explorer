import { App } from "~app"
import { AppEvent } from "~app/types"
import { dispatch } from "~app/helpers"

const app = App()
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
document.getElementById("root")!.appendChild(app)
dispatch(app, AppEvent.MOUNTED)
