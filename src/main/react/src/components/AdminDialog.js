import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent  from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Dialog from '@material-ui/core/Dialog'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'
import Slide from '@material-ui/core/Slide'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ListItem from '@material-ui/core/List'
import MenuItem from '@material-ui/core/Menu'
import { editIdea } from '../api/api.js'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    '& li': {
      padding: 0
    }
  },
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textFieldInput: {
    height: '1.5rem'
  }
})

class AdminDialog extends Component {
  handleChange = name => event => {
    let stateVar = 'd_' + [name]
    this.props.changeParent(stateVar, event.target.value)
  }

  handleSave = () => {
    editIdea(this.props)
    this.props.handleClose()
  }

  handleFlag = () => {
    const payload = Object.assign({}, this.props, { flagged: true })
    editIdea(payload)
    this.props.handleClose()
  }

  handleArchive = () => {
    const payload = Object.assign({}, this.props, { is_archived: true })
    editIdea(payload)
    this.props.handleClose()
  }

  generateMenuItem = () => {
    const categoryLabels = [
      'General',
      'Design',
      'Issue',
      'Navigation',
      'Mobile Apps',
      'New Feature'
    ]
    let menuArray = []
    for (let i = 0; i < categoryLabels.length; i++) {
      menuArray.push(<MenuItem key={"menu-" + i} value={i}>{categoryLabels[i]}</MenuItem>)
    }
    return menuArray
  }

  render() {
    const { classes } = this.props
    let {
      title,
      description,
      vote,
      approved,
      category,
      flagged,
      submitter
    } = this.props

    const categoryValues = [
      'general',
      'design',
      'issue',
      'navigation',
      'mobile',
      'feature'
    ]

    category = categoryValues.indexOf(category)

    if (title === null || title === undefined) {
      title = 'null'
    }
    if (description === null || description === undefined) {
      description = 'null'
    }
    if (approved === null || approved === undefined) {
      approved = false
    }

    let color
    if (this.props.approved) {
      color = { backgroundColor: '#00E676' }
    } else {
      color = { backgroundColor: '#E53935' }
    }

    const switchColor = '#e0eef6'

    return (
      <Dialog
        open={this.props.open}
        role="dialog"
        tabIndex="0"
        onClose={this.props.handleClose}
        transition={Slide}
        className={classes.root}
        contentStyle={{ width: '100%' }}
      >
        <ListItem style={{ padding: 0 }}>
          <Card style={{ flex: 1 }}>
            <div style={{ width: '100%' }}>
              <div className={classes.header} style={color}>
                {flagged === false && (
                  <FormControlLabel
                    style={{
                      marginLeft: '12px',
                      display: 'flex'
                    }}
                    control={
                      <Switch
                        style={{ color: switchColor }}
                        checked={approved}
                        onChange={() =>
                          this.props.changeParent('d_approved', !approved)
                        }
                      />
                    }
                    label="Approved"
                  />
                )}
                <Typography type="subheading" style={{ padding: 18 }}>
                  Votes: {vote}
                </Typography>
              </div>
              <Typography
                style={{ paddingLeft: 16, paddingTop: 12 }}
                type="subheading"
              >
                Submitted By: {submitter}
              </Typography>
              <div
                className="title"
                style={{
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'row',
                  flexFlow: 'wrap'
                }}
              >
                <TextField
                  label="Title"
                  style={{ flex: '1 1 auto', marginRight: 8 }}
                  value={title}
                  onChange={this.handleChange('title')}
                />
                <FormControl>
                  <InputLabel htmlFor="idea-category">Category</InputLabel>
                  <Select
                    value={category}
                    onChange={this.handleChange('category')}
                    input={<Input name="category" id="idea-category" />}
                  >
                    {this.generateMenuItem()}
                  </Select>
                </FormControl>
              </div>
              <CardContent style={{ paddingLeft: '18px' }}>
                <TextField
                  multiline
                  rowsMax="4"
                  label="Description"
                  margin="normal"
                  style={{ width: '100%' }}
                  value={description}
                  onChange={this.handleChange('desc')}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 18
                  }}
                >
                  {Object.is(approved, true) && (
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <TextField
                        id="date"
                        style={{ width: '45%' }}
                        label="Voting Starts"
                        inputClassName={classes.textFieldInput}
                        type="date"
                        value={this.props.start}
                        defaultValue={this.props.start}
                        onChange={this.handleChange('start')}
                      />
                      <TextField
                        id="dater"
                        style={{ width: '45%' }}
                        label="Voting Ends"
                        inputClassName={classes.textFieldInput}
                        type="date"
                        value={this.props.end}
                        defaultValue={this.props.end}
                        onChange={this.handleChange('end')}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              {flagged === false && (
                <CardActions
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button color="accent" onClick={this.handleArchive}>
                    Archive
                  </Button>
                  <Button color="accent" onClick={this.handleFlag}>
                    Flag
                  </Button>
                  <Button color="accent" onClick={this.handleSave}>
                    Save
                  </Button>
                </CardActions>
              )}
            </div>
            <Typography
              component="p"
              style={{ marginRight: 20, fontSize: '24px' }}
            />
          </Card>
        </ListItem>
      </Dialog>
    )
  }
}

AdminDialog.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AdminDialog)
