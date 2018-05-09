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

import {
  submitIdea,
  categoryLabels,
  categoryValues,
  titleMax,
  descriptionMax
} from '../api/api.js'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  closeButton: {
    marginRight: 24
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '85%',
    alignSelf: 'center'
  },
  instructions: {
    paddingTop: '20px'
  },
  titleText: {
    width: '50%'
  },
  descText: {
    width: '100%'
  }
})

class IdeaEditor extends Component {
  state = {
    category: 'general',
    title: '',
    titleError: false,
    descError: false,
    description: '',
    snackOpen: false,
    snackMessage: 'An error occured',
    submissionStatus: 0
  }

  handleRadioChange = (event, category) => {
    this.setState({ category })
  }

  handleTitleChange = event => {
    if (
      this.state.title.length < titleMax ||
      event.target.value.length < this.state.title.length
    ) {
      this.setState({ title: event.target.value, titleError: false })
    } else {
      this.setState({ titleError: true })
    }
  }

  handleDescChange = event => {
    if (
      this.state.description.length < descriptionMax ||
      event.target.value.length < this.state.description.length
    ) {
      this.setState({ description: event.target.value, descError: false })
    } else {
      this.setState({ descError: true })
    }
  }

  generateForm = async () => {
    let error = false
    if (this.state.title === '' || this.state.title.length > titleMax) {
      this.setState({ titleError: true })
      error = true
    }

    if (
      this.state.description === '' ||
      this.state.description.length > descriptionMax
    ) {
      this.setState({ descError: true })
      error = true
    }

    //This local variable (and not state) is used because state sometimes doesn't update
    //quickly enough for this check
    if (error) {
      return
    }

    //Submits form to backend
    let status = await submitIdea(
      this.state.title,
      this.state.description,
      this.state.category,
      this.props.token
    )

    this.props.openSnackbar(status)

    //Clears this dialog for next time
    this.setState({
      description: '',
      title: '',
      category: 'general'
    })

    //Closes dialog
    this.props.handleClose()
  }

  //Returns a list of radio buttons the same length as number of categories
  generateRadioGroup = () => {
    let group = []

    for (let i = 0; i < categoryValues.length; i++) {
      group.push(
        <FormControlLabel
          value={categoryValues[i]}
          control={<Radio />}
          label={categoryLabels[i]}
        />
      )
    }
    return group
  }

  render() {
    const { classes } = this.props
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
                className={classes.closeButton}
              >
                <Close />
              </IconButton>
              <Typography type="title" color="inherit">
                Compose{' '}
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent className={classes.dialogContent}>
            <Typography
              align="center"
              type="subheading"
              className={classes.instructions}
            >
              Submit an idea on how to improve MySail. Give it a name, a brief
              description, and a category.{' '}
            </Typography>
            <TextField
              required
              id="idea-title"
              label="Title"
              className={classes.titleText}
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
              className={classes.descText}
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
                {this.generateRadioGroup()}
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.generateForm} color="accent">
              Submit{' '}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(IdeaEditor)
