import { App } from "~pages/app"
import { dispatch, AppEvent } from "~pages/app/events"

const app = App()
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
document.getElementById("root")!.appendChild(app)
dispatch(app, AppEvent.MOUNTED)
