import React, { Component } from 'react'
import ModeEditIcon from 'material-ui-icons/ModeEdit'
import Button from 'material-ui/Button'
import Dialog, { DialogContent, DialogActions } from 'material-ui/Dialog'
import AppBar from 'material-ui/AppBar'
import { submitIdea } from '../api/api.js'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import { Close } from 'material-ui-icons'
import TextField from 'material-ui/TextField'
import Slide from 'material-ui/transitions/Slide'
import Radio, { RadioGroup } from 'material-ui/Radio'
import { badWords } from '../utils/badWords'
import Snackbar from 'material-ui/Snackbar';
import Slide from 'material-ui/transitions/Slide';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form'

class IdeaEditor extends Component {
  state = {
    category: 'general',
    title: '',
    titleError: false,
    descError: false,
    description: ''
  }

  handleChange = (event, category) => {
    this.setState({ category })
  }

  handleTitleChange = event => {
    if (this.state.title.length < 50 || event.target.value.length < this.state.title.length){
      this.setState({ title: event.target.value, titleError: false })
    }else{
      this.setState({ titleError: true})
    }
  }

  handleDescChange = event => {
    if (this.state.description.length < 800 || event.target.value.length < this.state.description.length){
      this.setState({ description: event.target.value, descError: false })
    }else{
      this.setState({descError: true})
    }
  }

  generateForm = () => {
    if (this.state.title === '' || this.state.title.length > 60) {
      alert('Title')
      return
    }

    if (this.state.description === '' || this.state.description.length > 800){
      alert('Description')
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
            inputProps={{maxlength:60}}
            margin="normal"
            value={this.state.title}
            error={this.state.titleError}
            onChange={this.handleTitleChange}
          />
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
          <FormControl style={{ marginTop: 50 }} component="fieldset" required>
            <FormLabel component="legend"> Category </FormLabel>
            <RadioGroup
              aria-label="category"
              name="category"
              value={this.state.category}
              onChange={this.handleChange}
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
    )
  }
}

export default IdeaEditor
