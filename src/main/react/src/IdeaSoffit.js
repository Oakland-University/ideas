import React, { Component } from "react"
import IdeaList from "./IdeaList"
import ModeEditIcon from "material-ui-icons/ModeEdit"
import Button from "material-ui/Button"
import Dialog, { DialogContent } from "material-ui/Dialog"
import AppBar from "material-ui/AppBar"
import { submitIdea } from "./api/api.js"
import Toolbar from "material-ui/Toolbar"
import IconButton from "material-ui/IconButton"
import Typography from "material-ui/Typography"
import { ArrowBack, Send } from "material-ui-icons"
import TextField from "material-ui/TextField"
import Slide from "material-ui/transitions/Slide"
import Radio, { RadioGroup } from "material-ui/Radio"
import { badWords } from "./utils/badWords"
import { FormLabel, FormControl, FormControlLabel } from "material-ui/Form"
import IdeaEditor from "./components/IdeaEditor"

/* global pidm */
/* global token */

const buttonStyle = {
  marginTop: "-37px",
  marginRight: "28px"
}

class IdeaSoffit extends Component {
  state = {
    open: false,
    value: "general",
    title: "",
    description: ""
  }

  handleRequestClose = () => {
    this.setState({ open: false })
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  render() {
    return (
      <div
        className="idea-soffit-root"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end"
        }}
      >
        <IdeaList url="./api/example.json" token={token} />
        <Button
          fab
          color="accent"
          style={buttonStyle}
          onClick={this.handleOpen}
        >
          <ModeEditIcon />
        </Button>
      </div>
    )
  }
}

export default IdeaSoffit
