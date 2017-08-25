import React, { Component } from "react"
import PropTypes from "prop-types"
import IdeaList from "./IdeaList"
import ModeEditIcon from "material-ui-icons/ModeEdit"
import Button from "material-ui/Button"
import Dialog, {DialogContent} from "material-ui/Dialog"
import List, { ListItem, ListItemText } from "material-ui/List"
import Divider from "material-ui/Divider"
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import IconButton from "material-ui/IconButton"
import Typography from "material-ui/Typography"
import {ArrowBack, Send} from "material-ui-icons"
import TextField from 'material-ui/TextField'
import Slide from "material-ui/transitions/Slide"
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';

const buttonStyle = {
  marginTop: "-37px",
  marginRight: "28px"
}

class IdeaSoffit extends Component {
  state = {
    open: false,
    value: "general"
  }

  handleRequestClose = () => {
    this.setState({ open: false })
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleChange = (event, value) => {
    this.setState({ value });
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
                style={{marginRight: 24}}
              >
                <ArrowBack />
              </IconButton>
              <Typography type="title" color="inherit" style={{flex: 1}}>
                Compose
              </Typography>
              <Button color="contrast" onClick={this.handleRequestClose}>
                Submit 
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent
            style={{display: "flex", flexDirection: "column", width: "80%", alignSelf: "center" }}
          >
          <Typography type="title" color="inherit">
            Do you have a problem with or suggestion for MySail?
            Feel free to submit either here, and allow other students to express their opinions on the issue by
            voting up or down on any given idea. 
            <br/>
            All ideas will be checked by an administrator before being shown to students. 
            <br/>
            Having an idea highly upvoted is a good way to bring it to the MySail team's attention, but does not
            guaruntee any action.
          </Typography>
          <TextField
            required
            id="idea-title"
            label="Title"
            style={{width: "50%"}}
            margin="normal"
          />
          <TextField
            required
            id="idea-description"
            label="Description"
            multiline
            rows="4"
            rowsMax="10"
            style={{width: "100%"}}
            margin="normal"
          />
          <FormControl style={{marginTop: 50}} component="fieldset" required>
            <FormLabel component="legend">Category</FormLabel>
            <RadioGroup
              aria-label="category"
              name="category"
              value={this.state.value}
              onChange={this.handleChange}
              style={{flexDirection: "row", justifyContent: "space-around"}}
            >
              <FormControlLabel value="general" control={<Radio />} label="General" />
              <FormControlLabel value="design" control={<Radio />} label="Design" />
              <FormControlLabel value="issue" control={<Radio />} label="Issue" />
              <FormControlLabel value="navigation" control={<Radio />} label="Navigation" />
              <FormControlLabel value="mobile-apps" control={<Radio />} label="Mobile Apps" />
            </RadioGroup>
          </FormControl>
          </DialogContent>
          <Button fab color="accent" aria-label="edit" style={{position: "absolute", bottom: "15%", right: "10%"}}>
            <Send />
          </Button>
        </Dialog>
      </div>
    )
  }
}

export default IdeaSoffit
