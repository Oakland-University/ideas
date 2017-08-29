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

  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleTitleChange = event => {
    this.setState({ title: event.target.value })
  }

  handleDescChange = event => {
    this.setState({ description: event.target.value })
  }

  generateForm = () => {
    for (let word of badWords) {
      if (
        this.state.title.includes(word) ||
        this.state.description.includes(word)
      ) {
        alert("Check yourself, b")
      }
    }
    //console.log(this.state.title)
    //console.log(this.state.description)
    //console.log(this.state.value)
    //console.log(token)
    //submitIdea(this.state.title, this.state.description, this.state.value, token)
    this.setState({
      description: "",
      title: "",
      value: "general",
      open: false
    })
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
        <IdeaList url="./api/example.json" />
        <Button
          fab
          color="accent"
          style={buttonStyle}
          onClick={this.handleOpen}
        >
          <ModeEditIcon />
        </Button>
        <Dialog
          fullScreen
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          transition={<Slide direction="up" />}
        >
          <AppBar position="relative">
            <Toolbar>
              <IconButton
                color="contrast"
                onClick={this.handleRequestClose}
                aria-label="Close"
                style={{ marginRight: 24 }}
              >
                <ArrowBack />
              </IconButton>
              <Typography type="title" color="inherit" style={{ flex: 1 }}>
                Compose
              </Typography>
              <Button color="contrast" onClick={this.handleRequestClose}>
                Submit{" "}
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              alignSelf: "center"
            }}
          >
            <Typography type="title" color="inherit">
              Do you have a problem with or suggestion for MySail?
              Feel free to submit either here, and allow other students to express their opinions on the issue by
              voting up or down on any given idea.
              <br />
              All ideas will be checked by an administrator before being shown to students.
              {" "}
              <br />
              Having an idea highly upvoted is a good way to bring it to the MySail team's attention, but does not
              guaruntee any action.
            </Typography>
            <TextField
              required
              id="idea-title"
              label="Title"
              style={{ width: "50%" }}
              margin="normal"
              onChange={this.handleTitleChange}
            />
            <TextField
              required
              id="idea-description"
              label="Description"
              multiline
              rows="4"
              rowsMax="10"
              style={{ width: "100%" }}
              margin="normal"
              onChange={this.handleDescChange}
            />
            <FormControl
              style={{ marginTop: 50 }}
              component="fieldset"
              required
            >
              <FormLabel component="legend">Category</FormLabel>
              <RadioGroup
                aria-label="category"
                name="category"
                value={this.state.value}
                onChange={this.handleChange}
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <FormControlLabel
                  value="general"
                  control={<Radio />}
                  label="General"
                />
                <FormControlLabel
                  value="design"
                  control={<Radio />}
                  label="Design"
                />
                <FormControlLabel
                  value="issue"
                  control={<Radio />}
                  label="Issue"
                />
                <FormControlLabel
                  value="navigation"
                  control={<Radio />}
                  label="Navigation"
                />
                <FormControlLabel
                  value="mobile-apps"
                  control={<Radio />}
                  label="Mobile Apps"
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <Button
            fab
            color="accent"
            aria-label="edit"
            style={{ position: "absolute", bottom: "15%", right: "10%" }}
            onClick={this.generateForm}
          >
            <Send />
          </Button>
        </Dialog>
      </div>
    )
  }
}

export default IdeaSoffit
