import React, { Component } from 'react'
import { ListItem } from 'material-ui/List'
import Slide from 'material-ui/transitions/Slide'
import Typography from 'material-ui/Typography'
import Switch from 'material-ui/Switch'
import { FormControl, FormControlLabel } from 'material-ui/Form'
import { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import Card, { CardContent, CardActions } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import PropTypes from 'prop-types'
import Input, { InputLabel } from 'material-ui/Input'
import Select from 'material-ui/Select'
import Dialog from 'material-ui/Dialog'
import { editIdea } from '../api/api.js'
import { withStyles } from 'material-ui/styles'

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
  }

  render() {
    const { classes } = this.props
    const d = new Date()
    let title = this.props.title
    let desc = this.props.description
    let vote = this.props.vote
    let approved = this.props.approved
    const category = this.props.category
    const submitter = this.props.submitter

    if (title === null || title === undefined) {
      title = 'null'
    }
    if (desc === null || desc === undefined) {
      desc = 'ull'
    }
    if (approved === null || approved === undefined) {
      approved = false
    }

    let color
    if (this.props.approved) {
      color = { backgroundColor: '#00E676' }
    } else {
      console.log()
      color = { backgroundColor: '#E53935' }
    }

    const switchColor = '#e0eef6'

    return (
      <Dialog
        open={this.props.open}
        role="dialog"
        tabIndex="0"
        onRequestClose={this.props.handleClose}
        transition={Slide}
        className={classes.root}
        contentStyle={{ width: '100%' }}
      >
        <ListItem>
          <Card style={{ flex: 1 }}>
            <div style={{ width: '100%' }}>
              <div className={classes.header} style={color}>
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
                <FormControl
                  style={{ flex: '1 1 auto', marginLeft: 8, marginRight: 8 }}
                >
                  <InputLabel htmlFor="age-simple">Category</InputLabel>
                  <Select
                    value={category}
                    onChange={this.handleChange('category')}
                    input={<Input id="category-select" />}
                  >
                    <MenuItem value={0}>General</MenuItem>
                    <MenuItem value={10}>Issue</MenuItem>
                    <MenuItem value={20}>Mobile Apps</MenuItem>
                    <MenuItem value={30}>Design</MenuItem>
                    <MenuItem value={40}>Navigation</MenuItem>
                    <MenuItem value={50}>New Feature</MenuItem>
                    <MenuItem value={60}>Archived</MenuItem>
                    <MenuItem value={70}>Flagged</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <CardContent style={{ paddingLeft: '18px' }}>
                <TextField
                  multiline
                  rowsMax="4"
                  label="Description"
                  margin="normal"
                  style={{ width: '100%', height: 18 }}
                  value={desc}
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
              <CardActions
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button color="accent" onClick={this.handleSave}>
                  Save
                </Button>
              </CardActions>
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
