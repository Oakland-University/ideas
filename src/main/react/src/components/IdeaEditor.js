//TODO Continue code refactor from this file
import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Button from 'material-ui/Button'
import { Close } from 'material-ui-icons'
import Dialog, { DialogContent, DialogActions } from 'material-ui/Dialog'
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form'
import IconButton from 'material-ui/IconButton'
import Radio, { RadioGroup } from 'material-ui/Radio'
import Slide from 'material-ui/transitions/Slide'
import Snackbar from 'material-ui/Snackbar'
import { submitIdea } from '../api/api.js'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'

class IdeaEditor extends Component {
  state = {
    category: 'general',
    title: '',
    titleError: false,
    descError: false,
    description: '',
    snackOpen: false,
    snackMessage: 'An error occured'
  }

  handleSnackClose = () => {
    this.setState({ snackOpen: false })
  }

  handleRadioChange = (event, category) => {
    this.setState({ category })
  }

  handleTitleChange = event => {
    if (
      this.state.title.length < 50 ||
      event.target.value.length < this.state.title.length
    ) {
      this.setState({ title: event.target.value, titleError: false })
    } else {
      this.setState({ titleError: true })
    }
  }

  handleDescChange = event => {
    if (
      this.state.description.length < 800 ||
      event.target.value.length < this.state.description.length
    ) {
      this.setState({ description: event.target.value, descError: false })
    } else {
      this.setState({ descError: true })
    }
  }

  generateForm = () => {
    let error = false
    if (this.state.title === '' || this.state.title.length > 60) {
      this.setState({ titleError: true })
      error = true
    }

    if (this.state.description === '' || this.state.description.length > 800) {
      this.setState({ descError: true })
      error = true
    }

    if (error) {
      return
    }

    submitIdea(
      this.state.title,
      this.state.description,
      this.state.category,
      this.props.token
    )

    this.setState({
      description: '',
      title: '',
      category: 'general'
    })

    this.props.handleClose()

    //TODO: write function to call parent onClose
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          role="dialog"
          tabIndex="0"
          onRequestClose={this.props.handleClose}
          transition={Slide}
        >
          <AppBar position="relative">
            <Toolbar>
              <IconButton
                color="contrast"
                onClick={this.props.handleClose}
                aria-label="Close"
                style={{ marginRight: 24 }}
              >
                <Close />
              </IconButton>
              <Typography type="title" color="inherit" style={{ flex: 1 }}>
                Compose{' '}
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '85%',
              alignSelf: 'center'
            }}
          >
            <Typography
              align="center"
              type="subheading"
              style={{ paddingTop: '20px' }}
            >
              Submit an idea on how to improve MySail. Give it a name, a brief
              description, and a category.{' '}
            </Typography>
            <TextField
              required
              id="idea-title"
              label="Title"
              style={{ width: '50%' }}
              inputProps={{ maxlength: 60 }}
              margin="normal"
              value={this.state.title}
              error={this.state.titleError}
              onChange={this.handleTitleChange}
            />
            {this.state.titleError && (
              <Typography>
                Title field must be filled out and less than 60 characters
              </Typography>
            )}
            <TextField
              required
              id="idea-description"
              label="Description"
              multiline
              rows="4"
              value={this.state.description}
              style={{ width: '100%' }}
              margin="normal"
              error={this.state.descError}
              onChange={this.handleDescChange}
            />
            {this.state.descError && (
              <Typography>
                Description field must be filled out and less than 800
                characters
              </Typography>
            )}
            <FormControl
              style={{ marginTop: 50 }}
              component="fieldset"
              required
            >
              <FormLabel component="legend"> Category </FormLabel>
              <RadioGroup
                aria-label="category"
                name="category"
                value={this.state.category}
                onChange={this.handleRadioChange}
                style={{ height: '125px' }}
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
                  value="mobile"
                  control={<Radio />}
                  label="Mobile Apps"
                />
                <FormControlLabel
                  value="feature"
                  control={<Radio />}
                  label="New Feature"
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.generateForm} color="accent">
              Submit{' '}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={this.state.snackOpen}
          onClose={this.handleSnackClose}
          transition={Slide}
          SnackbarContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{this.state.snackMessage}</span>}
        />
      </div>
    )
  }
}

export default IdeaEditor
