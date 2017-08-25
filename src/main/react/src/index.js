import React from "react"
import ReactDOM from "react-dom"
import IdeaSoffit from "./IdeaSoffit"
import { MuiThemeProvider } from "material-ui/styles"
import registerServiceWorker from "./registerServiceWorker"

ReactDOM.render(
  <MuiThemeProvider>
    <IdeaSoffit />
  </MuiThemeProvider>,
  document.getElementById("idea-root")
)
registerServiceWorker()
